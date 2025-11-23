import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserStats } from '../../entities/user-stats.entity';

export enum TrainingStat {
    STRENGTH = 'strength',
    DEFENSE = 'defense',
    AGILITY = 'agility',
    INTELLIGENCE = 'intelligence',
}

@Injectable()
export class GymService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserStats)
        private userStatsRepository: Repository<UserStats>,
    ) { }

    async train(userId: string, stat: TrainingStat) {
        // Get user with stats
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['stats'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user is in prison or hospital
        if (user.prisonReleaseTime && new Date(user.prisonReleaseTime) > new Date()) {
            throw new BadRequestException('You are in prison');
        }

        if (user.hospitalReleaseTime && new Date(user.hospitalReleaseTime) > new Date()) {
            throw new BadRequestException('You are in hospital');
        }

        // Training costs
        const energyCost = 10;
        const baseCost = 100;
        const currentStatValue = user.stats[stat];
        const moneyCost = baseCost * Math.pow(1.1, Math.floor(currentStatValue / 10));

        // Check energy
        if (user.energy < energyCost) {
            throw new BadRequestException('Not enough energy');
        }

        // Check money
        if (Number(user.moneyCash) < moneyCost) {
            throw new BadRequestException('Not enough cash');
        }

        // Deduct costs
        user.energy -= energyCost;
        user.moneyCash = Number(user.moneyCash) - moneyCost;

        // Calculate stat gain (1-3 points, with diminishing returns)
        const baseGain = Math.floor(Math.random() * 3) + 1;
        const diminishingFactor = Math.max(0.5, 1 - (currentStatValue / 500));
        const statGain = Math.max(1, Math.floor(baseGain * diminishingFactor));

        // Increase stat
        user.stats[stat] += statGain;

        // Save changes
        await this.userStatsRepository.save(user.stats);
        await this.userRepository.save(user);

        return {
            success: true,
            stat,
            gain: statGain,
            newValue: user.stats[stat],
            energySpent: energyCost,
            moneySpent: moneyCost,
        };
    }

    async getTrainingCosts(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['stats'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const baseCost = 100;
        const energyCost = 10;

        return {
            strength: {
                energyCost,
                moneyCost: Math.floor(baseCost * Math.pow(1.1, Math.floor(user.stats.strength / 10))),
                currentValue: user.stats.strength,
            },
            defense: {
                energyCost,
                moneyCost: Math.floor(baseCost * Math.pow(1.1, Math.floor(user.stats.defense / 10))),
                currentValue: user.stats.defense,
            },
            agility: {
                energyCost,
                moneyCost: Math.floor(baseCost * Math.pow(1.1, Math.floor(user.stats.agility / 10))),
                currentValue: user.stats.agility,
            },
            intelligence: {
                energyCost,
                moneyCost: Math.floor(baseCost * Math.pow(1.1, Math.floor(user.stats.intelligence / 10))),
                currentValue: user.stats.intelligence,
            },
        };
    }
}
