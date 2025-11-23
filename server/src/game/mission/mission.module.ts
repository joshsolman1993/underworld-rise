import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { MissionSeederService } from './mission-seeder.service';
import { Mission } from '../../entities/mission.entity';
import { UserMission } from '../../entities/user-mission.entity';
import { User } from '../../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Mission, UserMission, User])],
    controllers: [MissionController],
    providers: [MissionService, MissionSeederService],
    exports: [MissionService],
})
export class MissionModule { }
