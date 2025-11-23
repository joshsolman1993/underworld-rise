import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrimeController } from './crime.controller';
import { CrimeService } from './crime.service';
import { CrimeSeederService } from './crime-seeder.service';
import { Crime } from '../../entities/crime.entity';
import { User } from '../../entities/user.entity';
import { UserStats } from '../../entities/user-stats.entity';
import { MissionModule } from '../mission/mission.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Crime, User, UserStats]),
        MissionModule,
    ],
    controllers: [CrimeController],
    providers: [CrimeService, CrimeSeederService],
    exports: [CrimeService],
})
export class CrimeModule { }
