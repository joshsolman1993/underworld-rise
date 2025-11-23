import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GangController } from './gang.controller';
import { GangService } from './gang.service';
import { Gang } from '../../entities/gang.entity';
import { GangMember } from '../../entities/gang-member.entity';
import { User } from '../../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Gang, GangMember, User])],
    controllers: [GangController],
    providers: [GangService],
    exports: [GangService],
})
export class GangModule { }
