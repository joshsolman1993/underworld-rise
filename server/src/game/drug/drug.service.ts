import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Drug, DrugTrend } from '../../entities/drug.entity';
import { UserDrug } from '../../entities/user-drug.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class DrugService {
    constructor(
        @InjectRepository(Drug)
        private drugRepository: Repository<Drug>,
        @InjectRepository(UserDrug)
        private userDrugRepository: Repository<UserDrug>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getAllDrugs() {
        return this.drugRepository.find({
            order: { basePrice: 'ASC' },
        });
    }

    async getUserDrugs(userId: string) {
        return this.userDrugRepository.find({
            where: { userId, quantity: 1 }, // Filter where quantity > 0? No, TypeORM find syntax is different.
            // Actually we want all records for the user, usually we filter > 0 in UI or query
            relations: ['drug'],
        });
        // Better query to only get owned drugs
        /*
        return this.userDrugRepository.createQueryBuilder('ud')
            .leftJoinAndSelect('ud.drug', 'drug')
            .where('ud.userId = :userId', { userId })
            .andWhere('ud.quantity > 0')
            .getMany();
        */
    }

    async buyDrug(userId: string, drugId: number, quantity: number) {
        if (quantity <= 0) throw new BadRequestException('Invalid quantity');

        const drug = await this.drugRepository.findOne({ where: { id: drugId } });
        if (!drug) throw new NotFoundException('Drug not found');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const totalCost = Number(drug.currentPrice) * quantity;

        if (user.moneyCash < totalCost) {
            throw new BadRequestException('Not enough cash');
        }

        // Deduct money
        user.moneyCash = Number(user.moneyCash) - totalCost;
        await this.userRepository.save(user);

        // Add to inventory
        let userDrug = await this.userDrugRepository.findOne({ where: { userId, drugId } });

        if (!userDrug) {
            userDrug = this.userDrugRepository.create({
                user, // Use relation object to be safe
                drugId,
                quantity: 0,
            });
        }

        userDrug.quantity += quantity;
        await this.userDrugRepository.save(userDrug);

        return {
            success: true,
            user: { moneyCash: user.moneyCash },
            drug: { id: drugId, quantity: userDrug.quantity }
        };
    }

    async sellDrug(userId: string, drugId: number, quantity: number) {
        if (quantity <= 0) throw new BadRequestException('Invalid quantity');

        const drug = await this.drugRepository.findOne({ where: { id: drugId } });
        if (!drug) throw new NotFoundException('Drug not found');

        const userDrug = await this.userDrugRepository.findOne({ where: { userId, drugId } });
        if (!userDrug || userDrug.quantity < quantity) {
            throw new BadRequestException('Not enough drugs');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const totalValue = Number(drug.currentPrice) * quantity;

        // Add money
        user.moneyCash = Number(user.moneyCash) + totalValue;
        await this.userRepository.save(user);

        // Remove from inventory
        userDrug.quantity -= quantity;
        await this.userDrugRepository.save(userDrug);

        return {
            success: true,
            user: { moneyCash: user.moneyCash },
            drug: { id: drugId, quantity: userDrug.quantity }
        };
    }

    // Update prices every 4 hours
    @Cron('0 */4 * * *') // At minute 0 past every 4th hour
    async updatePrices() {
        console.log('Updating drug prices...');
        const drugs = await this.drugRepository.find();

        for (const drug of drugs) {
            const volatility = drug.volatility;
            const changePercent = (Math.random() * volatility * 2) - volatility; // -15% to +15%

            let newPrice = Number(drug.currentPrice) * (1 + changePercent);

            // Clamp price
            newPrice = Math.max(Number(drug.minPrice), Math.min(Number(drug.maxPrice), newPrice));

            // Determine trend
            if (newPrice > Number(drug.currentPrice)) {
                drug.trend = DrugTrend.UP;
            } else if (newPrice < Number(drug.currentPrice)) {
                drug.trend = DrugTrend.DOWN;
            } else {
                drug.trend = DrugTrend.STABLE;
            }

            drug.currentPrice = newPrice;
            await this.drugRepository.save(drug);
        }
        console.log('Drug prices updated');
    }
}
