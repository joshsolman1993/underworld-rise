import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserStats } from './entities/user-stats.entity';
import { Crime } from './entities/crime.entity';
import { Item } from './entities/item.entity';
import { Inventory } from './entities/inventory.entity';
import { Gang } from './entities/gang.entity';
import { GangMember } from './entities/gang-member.entity';
import { CombatLog } from './entities/combat-log.entity';
import { MarketplaceListing } from './entities/marketplace-listing.entity';
import { MarketplaceTransaction } from './entities/marketplace-transaction.entity';
import { Mission } from './entities/mission.entity';
import { UserMission } from './entities/user-mission.entity';
import { Drug } from './entities/drug.entity';
import { UserDrug } from './entities/user-drug.entity';
import { AuthModule } from './auth/auth.module';
import { CrimeModule } from './game/crime/crime.module';
import { GymModule } from './game/gym/gym.module';
import { BankModule } from './game/bank/bank.module';
import { ShopModule } from './game/shop/shop.module';
import { RegenerationModule } from './game/regeneration/regeneration.module';
import { CombatModule } from './game/combat/combat.module';
import { GangModule } from './game/gang/gang.module';
import { MarketplaceModule } from './game/marketplace/marketplace.module';
import { AdminModule } from './admin/admin.module';
import { MissionModule } from './game/mission/mission.module';
import { DrugModule } from './game/drug/drug.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, UserStats, Crime, Item, Inventory, Gang, GangMember, CombatLog, MarketplaceListing, MarketplaceTransaction, Mission, UserMission, Drug, UserDrug],
        synchronize: true, // Set to false in production, use migrations instead
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CrimeModule,
    GymModule,
    BankModule,
    ShopModule,
    RegenerationModule,
    CombatModule,
    GangModule,
    MarketplaceModule,
    AdminModule,
    MissionModule,
    DrugModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
