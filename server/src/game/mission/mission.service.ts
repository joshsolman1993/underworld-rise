import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Mission, MissionType, MissionRequirementType } from '../../entities/mission.entity';
import { UserMission } from '../../entities/user-mission.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class MissionService {
    constructor(
        @InjectRepository(Mission)
        private missionRepository: Repository<Mission>,
        @InjectRepository(UserMission)
        private userMissionRepository: Repository<UserMission>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getMyMissions(userId: string) {
        console.log(`Getting missions for user ${userId}`);
        try {
            // Ensure user has missions assigned
            await this.assignMissions(userId);

            const userMissions = await this.userMissionRepository.find({
                where: { userId },
                relations: ['mission'],
                order: {
                    isClaimed: 'ASC',
                    isCompleted: 'DESC',
                    createdAt: 'DESC',
                },
            });
            console.log(`Found ${userMissions.length} missions for user ${userId}`);
            return userMissions;
        } catch (error) {
            console.error('Error in getMyMissions:', error);
            throw error;
        }
    }

    async assignMissions(userId: string) {
        console.log(`Assigning missions for user ${userId}`);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            console.log('User not found in assignMissions');
            return;
        }

        // 1. Assign Story Mission if none active
        const activeStoryMission = await this.userMissionRepository.findOne({
            where: {
                userId,
                mission: { type: MissionType.STORY },
                isCompleted: false,
            },
            relations: ['mission'],
        });

        if (!activeStoryMission) {
            // Find last completed story mission order
            const lastCompleted = await this.userMissionRepository.findOne({
                where: {
                    userId,
                    mission: { type: MissionType.STORY },
                    isCompleted: true,
                },
                relations: ['mission'],
                order: { mission: { order: 'DESC' } } as any,
            });

            const nextOrder = lastCompleted ? lastCompleted.mission.order + 1 : 1;

            const nextMission = await this.missionRepository.findOne({
                where: {
                    type: MissionType.STORY,
                    order: nextOrder,
                    minLevel: MoreThanOrEqual(user.level), // Actually usually we show next mission even if level is low, but maybe lock it? 
                    // Let's just find the next one by order regardless of level for now, or maybe filter by level
                },
            });

            if (nextMission) {
                await this.createUserMission(userId, nextMission.id);
            }
        }

        // 2. Assign Daily Missions if none for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyMissionsCount = await this.userMissionRepository.count({
            where: {
                userId,
                mission: { type: MissionType.DAILY },
                createdAt: MoreThanOrEqual(today),
            },
        });

        if (dailyMissionsCount === 0) {
            // Assign 3 random daily missions
            const dailies = await this.missionRepository
                .createQueryBuilder('mission')
                .where('mission.type = :type', { type: MissionType.DAILY })
                .orderBy('RANDOM()')
                .take(3)
                .getMany();

            for (const mission of dailies) {
                await this.createUserMission(userId, mission.id);
            }
        }
    }

    private async createUserMission(userId: string, missionId: number) {
        const exists = await this.userMissionRepository.findOne({ where: { userId, missionId } });
        if (exists && exists.mission.type === MissionType.STORY) return; // Don't duplicate story missions

        // Fetch user to ensure relation is set (though userId should work, explicit relation is safer)
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) return;

        const userMission = this.userMissionRepository.create({
            user, // Pass the full user object
            missionId,
            progress: 0,
            isCompleted: false,
            isClaimed: false,
        });
        return this.userMissionRepository.save(userMission);
    }

    async updateProgress(userId: string, type: MissionRequirementType, amount: number = 1, targetId?: string) {
        const activeMissions = await this.userMissionRepository.find({
            where: {
                userId,
                isCompleted: false,
                mission: { requirementType: type },
            },
            relations: ['mission'],
        });

        for (const um of activeMissions) {
            // Check target if specified (e.g. specific crime ID)
            if (um.mission.requirementTarget && um.mission.requirementTarget !== targetId) {
                continue;
            }

            um.progress += amount;

            if (um.progress >= um.mission.requirementValue) {
                um.progress = um.mission.requirementValue;
                um.isCompleted = true;
            }

            await this.userMissionRepository.save(um);
        }
    }

    async claimReward(userId: string, userMissionId: string) {
        const userMission = await this.userMissionRepository.findOne({
            where: { id: userMissionId, userId },
            relations: ['mission'],
        });

        if (!userMission) throw new NotFoundException('Mission not found');
        if (!userMission.isCompleted) throw new BadRequestException('Mission not completed');
        if (userMission.isClaimed) throw new BadRequestException('Reward already claimed');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.xp += userMission.mission.rewardXp;
        user.moneyCash = Number(user.moneyCash) + userMission.mission.rewardMoney;
        user.credits += userMission.mission.rewardCredits;

        userMission.isClaimed = true;

        await this.userRepository.save(user);
        await this.userMissionRepository.save(userMission);

        // Trigger assignment of next story mission if applicable
        if (userMission.mission.type === MissionType.STORY) {
            await this.assignMissions(userId);
        }

        return {
            success: true,
            rewards: {
                xp: userMission.mission.rewardXp,
                money: userMission.mission.rewardMoney,
                credits: userMission.mission.rewardCredits,
            },
            user: {
                xp: user.xp,
                moneyCash: user.moneyCash,
                credits: user.credits,
            }
        };
    }
}
