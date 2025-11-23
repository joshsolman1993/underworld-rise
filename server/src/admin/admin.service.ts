import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStats } from '../entities/user-stats.entity';
import { Crime } from '../entities/crime.entity';
import { Item } from '../entities/item.entity';
import { Gang } from '../entities/gang.entity';
import { CombatLog } from '../entities/combat-log.entity';
import { MarketplaceListing } from '../entities/marketplace-listing.entity';
import { UpdateUserStatsDto, GiveResourcesDto, BanUserDto, CreateCrimeDto, UpdateCrimeDto, CreateItemDto, UpdateItemDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserStats)
        private userStatsRepository: Repository<UserStats>,
        @InjectRepository(Crime)
        private crimeRepository: Repository<Crime>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Gang)
        private gangRepository: Repository<Gang>,
        @InjectRepository(CombatLog)
        private combatLogRepository: Repository<CombatLog>,
        @InjectRepository(MarketplaceListing)
        private marketplaceListingRepository: Repository<MarketplaceListing>,
    ) { }

    // ==================== USER MANAGEMENT ====================

    async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? [
                { username: Like(`%${search}%`) },
                { email: Like(`%${search}%`) },
            ]
            : {};

        const [users, total] = await this.userRepository.findAndCount({
            where: whereCondition,
            relations: ['stats', 'gang'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            users: users.map(user => this.sanitizeUser(user)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async banUser(userId: string, banDto: BanUserDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isBanned = true;
        user.bannedReason = banDto.reason;

        if (banDto.durationMinutes) {
            const bannedUntil = new Date();
            bannedUntil.setMinutes(bannedUntil.getMinutes() + banDto.durationMinutes);
            user.bannedUntil = bannedUntil;
        } else {
            user.bannedUntil = null as any; // Permanent ban
        }

        await this.userRepository.save(user);

        return {
            success: true,
            message: `User ${user.username} has been banned`,
            bannedUntil: user.bannedUntil,
        };
    }

    async unbanUser(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isBanned = false;
        user.bannedUntil = null as any;
        user.bannedReason = null as any;

        await this.userRepository.save(user);

        return {
            success: true,
            message: `User ${user.username} has been unbanned`,
        };
    }

    async updateUserStats(userId: string, statsDto: UpdateUserStatsDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['stats'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (statsDto.strength !== undefined) user.stats.strength = statsDto.strength;
        if (statsDto.defense !== undefined) user.stats.defense = statsDto.defense;
        if (statsDto.agility !== undefined) user.stats.agility = statsDto.agility;
        if (statsDto.intelligence !== undefined) user.stats.intelligence = statsDto.intelligence;

        await this.userStatsRepository.save(user.stats);

        return {
            success: true,
            stats: user.stats,
        };
    }

    async giveResources(userId: string, resourcesDto: GiveResourcesDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (resourcesDto.moneyCash !== undefined) {
            user.moneyCash = Number(user.moneyCash) + resourcesDto.moneyCash;
        }
        if (resourcesDto.moneyBank !== undefined) {
            user.moneyBank = Number(user.moneyBank) + resourcesDto.moneyBank;
        }
        if (resourcesDto.credits !== undefined) {
            user.credits += resourcesDto.credits;
        }
        if (resourcesDto.energy !== undefined) {
            user.energy = Math.min(100, user.energy + resourcesDto.energy);
        }
        if (resourcesDto.nerve !== undefined) {
            user.nerve = Math.min(100, user.nerve + resourcesDto.nerve);
        }
        if (resourcesDto.willpower !== undefined) {
            user.willpower = Math.min(100, user.willpower + resourcesDto.willpower);
        }
        if (resourcesDto.health !== undefined) {
            user.health = Math.min(100, user.health + resourcesDto.health);
        }

        await this.userRepository.save(user);

        return {
            success: true,
            message: 'Resources given successfully',
            user: this.sanitizeUser(user),
        };
    }

    async deleteUser(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.isAdmin) {
            throw new BadRequestException('Cannot delete admin users');
        }

        await this.userRepository.remove(user);

        return {
            success: true,
            message: `User ${user.username} has been deleted`,
        };
    }

    // ==================== SYSTEM STATISTICS ====================

    async getSystemStats() {
        const totalUsers = await this.userRepository.count();

        // Active users in last 24 hours (approximate)
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        const activeUsers = await this.userRepository.createQueryBuilder('user')
            .where('user.updatedAt >= :yesterday', { yesterday })
            .getCount();

        // Total money in economy
        const users = await this.userRepository.find();
        const totalMoney = users.reduce((sum, user) => {
            return sum + Number(user.moneyCash) + Number(user.moneyBank);
        }, 0);

        const totalGangs = await this.gangRepository.count();
        const totalCrimes = await this.crimeRepository.count();
        const totalItems = await this.itemRepository.count();
        const totalCombatLogs = await this.combatLogRepository.count();
        const totalMarketListings = await this.marketplaceListingRepository.count();

        return {
            totalUsers,
            activeUsers,
            totalMoney: Math.round(totalMoney),
            totalGangs,
            totalCrimes,
            totalItems,
            totalCombatLogs,
            totalMarketListings,
        };
    }

    // ==================== CRIME MANAGEMENT ====================

    async getAllCrimes() {
        return this.crimeRepository.find({
            order: { requiredLevel: 'ASC', difficulty: 'ASC' },
        });
    }

    async createCrime(crimeDto: CreateCrimeDto) {
        const crime = this.crimeRepository.create(crimeDto);
        await this.crimeRepository.save(crime);

        return {
            success: true,
            crime,
        };
    }

    async updateCrime(crimeId: number, crimeDto: UpdateCrimeDto) {
        const crime = await this.crimeRepository.findOne({ where: { id: crimeId } });
        if (!crime) {
            throw new NotFoundException('Crime not found');
        }

        Object.assign(crime, crimeDto);
        await this.crimeRepository.save(crime);

        return {
            success: true,
            crime,
        };
    }

    async deleteCrime(crimeId: number) {
        const crime = await this.crimeRepository.findOne({ where: { id: crimeId } });
        if (!crime) {
            throw new NotFoundException('Crime not found');
        }

        await this.crimeRepository.remove(crime);

        return {
            success: true,
            message: `Crime ${crime.name} has been deleted`,
        };
    }

    // ==================== ITEM MANAGEMENT ====================

    async getAllItems() {
        return this.itemRepository.find({
            order: { requiredLevel: 'ASC', price: 'ASC' },
        });
    }

    async createItem(itemDto: CreateItemDto) {
        const item = this.itemRepository.create(itemDto as any);
        await this.itemRepository.save(item);

        return {
            success: true,
            item,
        };
    }

    async updateItem(itemId: number, itemDto: UpdateItemDto) {
        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException('Item not found');
        }

        Object.assign(item, itemDto);
        await this.itemRepository.save(item);

        return {
            success: true,
            item,
        };
    }

    async deleteItem(itemId: number) {
        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException('Item not found');
        }

        await this.itemRepository.remove(item);

        return {
            success: true,
            message: `Item ${item.name} has been deleted`,
        };
    }

    // ==================== GANG MANAGEMENT ====================

    async getAllGangs() {
        return this.gangRepository.find({
            relations: ['leader'],
            order: { reputation: 'DESC' },
        });
    }

    async disbandGang(gangId: string) {
        const gang = await this.gangRepository.findOne({ where: { id: gangId } });
        if (!gang) {
            throw new NotFoundException('Gang not found');
        }

        await this.gangRepository.remove(gang);

        return {
            success: true,
            message: `Gang ${gang.name} has been disbanded`,
        };
    }

    async updateGangTreasury(gangId: string, amount: number) {
        const gang = await this.gangRepository.findOne({ where: { id: gangId } });
        if (!gang) {
            throw new NotFoundException('Gang not found');
        }

        gang.treasury = Number(gang.treasury) + amount;
        await this.gangRepository.save(gang);

        return {
            success: true,
            gang,
        };
    }

    // ==================== HELPER METHODS ====================

    private sanitizeUser(user: User) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
}
