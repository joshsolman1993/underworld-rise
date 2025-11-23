import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSeederService } from './admin-seeder.service';
import { User } from '../entities/user.entity';
import { UserStats } from '../entities/user-stats.entity';
import { Crime } from '../entities/crime.entity';
import { Item } from '../entities/item.entity';
import { Gang } from '../entities/gang.entity';
import { CombatLog } from '../entities/combat-log.entity';
import { MarketplaceListing } from '../entities/marketplace-listing.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserStats,
            Crime,
            Item,
            Gang,
            CombatLog,
            MarketplaceListing,
        ]),
    ],
    controllers: [AdminController],
    providers: [AdminService, AdminSeederService],
    exports: [AdminService],
})
export class AdminModule { }
