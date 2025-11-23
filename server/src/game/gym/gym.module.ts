import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymController } from './gym.controller';
import { GymService } from './gym.service';
import { User } from '../../entities/user.entity';
import { UserStats } from '../../entities/user-stats.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserStats])],
    controllers: [GymController],
    providers: [GymService],
    exports: [GymService],
})
export class GymModule { }
