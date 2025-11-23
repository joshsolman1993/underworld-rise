import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crime } from '../../entities/crime.entity';
import { User } from '../../entities/user.entity';
import { UserStats } from '../../entities/user-stats.entity';

import { MissionService } from '../mission/mission.service';
import { MissionRequirementType } from '../../entities/mission.entity';

@Injectable()
export class CrimeService {
    constructor(
        @InjectRepository(Crime)
        private crimeRepository: Repository<Crime>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserStats)
        @InjectRepository(UserStats)
        private userStatsRepository: Repository<UserStats>,
        private missionService: MissionService,
    ) { }

    async getAllCrimes() {
        return this.crimeRepository.find({
            order: { requiredLevel: 'ASC', difficulty: 'ASC' },
        });
    }

    async commitCrime(userId: string, crimeId: number) {
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

        // Get crime
        const crime = await this.crimeRepository.findOne({ where: { id: crimeId } });

        if (!crime) {
            throw new NotFoundException('Crime not found');
        }

        // Check level requirement
        if (user.level < crime.requiredLevel) {
            throw new BadRequestException(`You need to be level ${crime.requiredLevel} to commit this crime`);
        }

        // Check energy
        if (user.energy < crime.energyCost) {
            throw new BadRequestException('Not enough energy');
        }

        // Calculate success chance based on intelligence
        // Formula: (User Intelligence * 1.5 / Crime Difficulty) * 100, max 95%
        const successChance = Math.min(
            ((user.stats.intelligence * 1.5) / crime.difficulty) * 100,
            95
        );

        const randomRoll = Math.random() * 100;
        const isSuccess = randomRoll < successChance;

        // Deduct energy
        user.energy -= crime.energyCost;

        let result: any = {
            success: isSuccess,
            successChance: Math.round(successChance),
        };

        if (isSuccess) {
            // Success - give money and XP
            const moneyEarned = Math.floor(
                Math.random() * (crime.maxMoney - crime.minMoney + 1) + crime.minMoney
            );

            user.moneyCash = Number(user.moneyCash) + moneyEarned;
            user.xp += crime.xpReward;

            // Check for level up
            const xpNeeded = 100 * Math.pow(user.level, 2);
            if (user.xp >= xpNeeded) {
                user.level += 1;
                result.levelUp = true;
                result.newLevel = user.level;
            }

            result.moneyEarned = moneyEarned;
            result.xpEarned = crime.xpReward;

            // Update mission progress
            await this.missionService.updateProgress(userId, MissionRequirementType.CRIME, 1, crimeId.toString());
        } else {
            // Failure - check for jail
            const jailRoll = Math.random() * 100;
            if (jailRoll < crime.jailChance * 100) {
                // Go to jail
                const releaseTime = new Date();
                releaseTime.setMinutes(releaseTime.getMinutes() + crime.jailTimeMinutes);
                user.prisonReleaseTime = releaseTime;

                result.jailed = true;
                result.jailTime = crime.jailTimeMinutes;
            }
        }

        await this.userRepository.save(user);

        return result;
    }
}
