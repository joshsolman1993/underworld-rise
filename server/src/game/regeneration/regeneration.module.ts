import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegenerationService } from './regeneration.service';
import { User } from '../../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [RegenerationService],
    exports: [RegenerationService],
})
export class RegenerationModule { }
