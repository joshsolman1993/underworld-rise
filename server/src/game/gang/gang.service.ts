import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gang } from '../../entities/gang.entity';
import { GangMember, GangMemberRole } from '../../entities/gang-member.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class GangService {
    constructor(
        @InjectRepository(Gang)
        private gangRepository: Repository<Gang>,
        @InjectRepository(GangMember)
        private gangMemberRepository: Repository<GangMember>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createGang(userId: string, name: string, tag: string) {
        // Check if user is already in a gang
        const existingMembership = await this.gangMemberRepository.findOne({
            where: { userId },
        });

        if (existingMembership) {
            throw new BadRequestException('You are already in a gang');
        }

        // Check if gang name or tag already exists
        const existingGang = await this.gangRepository.findOne({
            where: [{ name }, { tag }],
        });

        if (existingGang) {
            throw new BadRequestException('Gang name or tag already exists');
        }

        // Create gang cost
        const creationCost = 100000; // $100,000
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (Number(user.moneyCash) < creationCost) {
            throw new BadRequestException('Not enough money to create a gang');
        }

        // Deduct money
        user.moneyCash = Number(user.moneyCash) - creationCost;
        await this.userRepository.save(user);

        // Create gang
        const gang = this.gangRepository.create({
            name,
            tag,
            leaderId: userId,
        });

        await this.gangRepository.save(gang);

        // Add creator as leader
        const member = this.gangMemberRepository.create({
            gangId: gang.id,
            userId,
            role: GangMemberRole.LEADER,
        });

        await this.gangMemberRepository.save(member);

        return gang;
    }

    async getGang(gangId: string) {
        const gang = await this.gangRepository.findOne({
            where: { id: gangId },
            relations: ['leader'],
        });

        if (!gang) {
            throw new NotFoundException('Gang not found');
        }

        const members = await this.gangMemberRepository.find({
            where: { gangId },
            relations: ['user'],
            order: { joinedAt: 'ASC' },
        });

        return {
            ...gang,
            members,
            memberCount: members.length,
        };
    }

    async getMyGang(userId: string) {
        const membership = await this.gangMemberRepository.findOne({
            where: { userId },
            relations: ['gang', 'gang.leader'],
        });

        if (!membership) {
            return null;
        }

        const members = await this.gangMemberRepository.find({
            where: { gangId: membership.gangId },
            relations: ['user'],
            order: { joinedAt: 'ASC' },
        });

        return {
            ...membership.gang,
            members,
            memberCount: members.length,
            myRole: membership.role,
        };
    }

    async inviteMember(gangId: string, inviterId: string, targetUserId: string) {
        // Check if inviter has permission (leader or officer)
        const inviterMembership = await this.gangMemberRepository.findOne({
            where: { gangId, userId: inviterId },
        });

        if (!inviterMembership || (inviterMembership.role !== GangMemberRole.LEADER && inviterMembership.role !== GangMemberRole.OFFICER)) {
            throw new ForbiddenException('You do not have permission to invite members');
        }

        // Check if target user is already in a gang
        const existingMembership = await this.gangMemberRepository.findOne({
            where: { userId: targetUserId },
        });

        if (existingMembership) {
            throw new BadRequestException('User is already in a gang');
        }

        // Add member
        const member = this.gangMemberRepository.create({
            gangId,
            userId: targetUserId,
            role: GangMemberRole.MEMBER,
        });

        await this.gangMemberRepository.save(member);

        return { message: 'Member invited successfully' };
    }

    async kickMember(gangId: string, kickerId: string, targetUserId: string) {
        // Check if kicker has permission (leader or officer)
        const kickerMembership = await this.gangMemberRepository.findOne({
            where: { gangId, userId: kickerId },
        });

        if (!kickerMembership || (kickerMembership.role !== GangMemberRole.LEADER && kickerMembership.role !== GangMemberRole.OFFICER)) {
            throw new ForbiddenException('You do not have permission to kick members');
        }

        // Cannot kick yourself
        if (kickerId === targetUserId) {
            throw new BadRequestException('You cannot kick yourself');
        }

        // Find target membership
        const targetMembership = await this.gangMemberRepository.findOne({
            where: { gangId, userId: targetUserId },
        });

        if (!targetMembership) {
            throw new NotFoundException('Member not found in this gang');
        }

        // Officers cannot kick other officers or the leader
        if (kickerMembership.role === GangMemberRole.OFFICER && targetMembership.role !== GangMemberRole.MEMBER) {
            throw new ForbiddenException('Officers can only kick regular members');
        }

        // Cannot kick the leader
        if (targetMembership.role === GangMemberRole.LEADER) {
            throw new ForbiddenException('Cannot kick the gang leader');
        }

        await this.gangMemberRepository.remove(targetMembership);

        return { message: 'Member kicked successfully' };
    }

    async leaveGang(userId: string) {
        const membership = await this.gangMemberRepository.findOne({
            where: { userId },
        });

        if (!membership) {
            throw new BadRequestException('You are not in a gang');
        }

        // Leader cannot leave, must disband instead
        if (membership.role === GangMemberRole.LEADER) {
            throw new BadRequestException('Leaders cannot leave, use disband instead');
        }

        await this.gangMemberRepository.remove(membership);

        return { message: 'Left gang successfully' };
    }

    async disbandGang(gangId: string, userId: string) {
        const membership = await this.gangMemberRepository.findOne({
            where: { gangId, userId },
        });

        if (!membership || membership.role !== GangMemberRole.LEADER) {
            throw new ForbiddenException('Only the leader can disband the gang');
        }

        // Remove all members
        await this.gangMemberRepository.delete({ gangId });

        // Delete gang
        await this.gangRepository.delete({ id: gangId });

        return { message: 'Gang disbanded successfully' };
    }

    async depositToTreasury(gangId: string, userId: string, amount: number) {
        const membership = await this.gangMemberRepository.findOne({
            where: { gangId, userId },
        });

        if (!membership) {
            throw new ForbiddenException('You are not a member of this gang');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (Number(user.moneyCash) < amount) {
            throw new BadRequestException('Not enough cash');
        }

        const gang = await this.gangRepository.findOne({ where: { id: gangId } });
        if (!gang) {
            throw new NotFoundException('Gang not found');
        }

        // Deduct from user
        user.moneyCash = Number(user.moneyCash) - amount;
        await this.userRepository.save(user);

        // Add to gang treasury
        gang.treasury = Number(gang.treasury) + amount;
        await this.gangRepository.save(gang);

        // Track contribution
        membership.contributedMoney = Number(membership.contributedMoney) + amount;
        await this.gangMemberRepository.save(membership);

        return { message: 'Deposited to treasury successfully', newTreasury: gang.treasury };
    }

    async getAllGangs(limit: number = 50) {
        const gangs = await this.gangRepository
            .createQueryBuilder('gang')
            .leftJoinAndSelect('gang.leader', 'leader')
            .loadRelationCountAndMap('gang.memberCount', 'gang.members')
            .orderBy('gang.reputation', 'DESC')
            .take(limit)
            .getMany();

        return gangs;
    }
}
