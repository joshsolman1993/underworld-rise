import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';

@Injectable()
export class RegenerationService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    // Run every minute
    @Cron(CronExpression.EVERY_MINUTE)
    async handleResourceRegeneration() {
        const now = new Date();
        const regenInterval = this.configService.get<number>('REGEN_INTERVAL_MINUTES') || 5;

        // Calculate how many minutes ago was the last regen
        const cutoffTime = new Date(now.getTime() - regenInterval * 60 * 1000);

        // Find users who need regeneration
        const users = await this.userRepository.find({
            where: [
                { lastEnergyUpdate: LessThan(cutoffTime) },
                { lastNerveUpdate: LessThan(cutoffTime) },
                { lastWillpowerUpdate: LessThan(cutoffTime) },
                { lastHealthUpdate: LessThan(cutoffTime) },
            ],
        });

        const energyRegenRate = this.configService.get<number>('ENERGY_REGEN_RATE') || 10;
        const nerveRegenRate = this.configService.get<number>('NERVE_REGEN_RATE') || 5;
        const willpowerRegenRate = this.configService.get<number>('WILLPOWER_REGEN_RATE') || 5;
        const healthRegenRate = this.configService.get<number>('HEALTH_REGEN_RATE') || 10;

        for (const user of users) {
            let updated = false;

            // Energy regeneration
            if (user.lastEnergyUpdate < cutoffTime && user.energy < 100) {
                user.energy = Math.min(100, user.energy + energyRegenRate);
                user.lastEnergyUpdate = now;
                updated = true;
            }

            // Nerve regeneration
            if (user.lastNerveUpdate < cutoffTime && user.nerve < 100) {
                user.nerve = Math.min(100, user.nerve + nerveRegenRate);
                user.lastNerveUpdate = now;
                updated = true;
            }

            // Willpower regeneration
            if (user.lastWillpowerUpdate < cutoffTime && user.willpower < 100) {
                user.willpower = Math.min(100, user.willpower + willpowerRegenRate);
                user.lastWillpowerUpdate = now;
                updated = true;
            }

            // Health regeneration
            if (user.lastHealthUpdate < cutoffTime && user.health < 100) {
                user.health = Math.min(100, user.health + healthRegenRate);
                user.lastHealthUpdate = now;
                updated = true;
            }

            if (updated) {
                await this.userRepository.save(user);
            }
        }

        if (users.length > 0) {
            console.log(`✅ Regenerated resources for ${users.length} users`);
        }
    }
}
