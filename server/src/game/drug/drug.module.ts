import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrugController } from './drug.controller';
import { DrugService } from './drug.service';
import { DrugSeederService } from './drug-seeder.service';
import { Drug } from '../../entities/drug.entity';
import { UserDrug } from '../../entities/user-drug.entity';
import { User } from '../../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Drug, UserDrug, User])],
    controllers: [DrugController],
    providers: [DrugService, DrugSeederService],
    exports: [DrugService],
})
export class DrugModule { }
