import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { User } from '../../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [BankController],
    providers: [BankService],
    exports: [BankService],
})
export class BankModule { }
