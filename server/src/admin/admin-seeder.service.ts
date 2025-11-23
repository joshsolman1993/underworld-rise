import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserStats } from '../entities/user-stats.entity';

@Injectable()
export class AdminSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserStats)
        private userStatsRepository: Repository<UserStats>,
    ) { }

    async onModuleInit() {
        await this.seedAdminUser();
    }

    private async seedAdminUser() {
        // Check if admin user already exists
        const existingAdmin = await this.userRepository.findOne({
            where: { isAdmin: true },
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }

        // Create admin user
        const passwordHash = await bcrypt.hash('Admin123!', 10);

        const adminUser = this.userRepository.create({
            username: 'admin',
            email: 'admin@underworld.local',
            passwordHash,
            isAdmin: true,
            level: 100,
            moneyCash: 1000000,
            moneyBank: 1000000,
            credits: 10000,
        });

        const savedAdmin = await this.userRepository.save(adminUser);

        // Create admin stats
        const adminStats = this.userStatsRepository.create({
            userId: savedAdmin.id,
            strength: 1000,
            defense: 1000,
            agility: 1000,
            intelligence: 1000,
        });

        await this.userStatsRepository.save(adminStats);

        console.log('✅ Admin user created successfully');
        console.log('   Email: admin@underworld.local');
        console.log('   Password: Admin123!');
        console.log('   ⚠️  Please change the password after first login!');
    }
}
