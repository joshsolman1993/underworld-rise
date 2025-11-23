import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    async deposit(userId: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (Number(user.moneyCash) < amount) {
            throw new BadRequestException('Not enough cash');
        }

        user.moneyCash = Number(user.moneyCash) - amount;
        user.moneyBank = Number(user.moneyBank) + amount;

        await this.userRepository.save(user);

        return {
            success: true,
            deposited: amount,
            newCash: Number(user.moneyCash),
            newBank: Number(user.moneyBank),
        };
    }

    async withdraw(userId: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (Number(user.moneyBank) < amount) {
            throw new BadRequestException('Not enough money in bank');
        }

        user.moneyBank = Number(user.moneyBank) - amount;
        user.moneyCash = Number(user.moneyCash) + amount;

        await this.userRepository.save(user);

        return {
            success: true,
            withdrawn: amount,
            newCash: Number(user.moneyCash),
            newBank: Number(user.moneyBank),
        };
    }

    async launderMoney(userId: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (Number(user.moneyCash) < amount) {
            throw new BadRequestException('Not enough cash to launder');
        }

        // Money laundering fee: 20-40% loss
        const minFee = this.configService.get<number>('MONEY_LAUNDERING_FEE_MIN') || 0.20;
        const maxFee = this.configService.get<number>('MONEY_LAUNDERING_FEE_MAX') || 0.40;
        const feePercent = minFee + Math.random() * (maxFee - minFee);
        const fee = Math.floor(amount * feePercent);
        const laundered = amount - fee;

        user.moneyCash = Number(user.moneyCash) - amount;
        user.moneyBank = Number(user.moneyBank) + laundered;

        await this.userRepository.save(user);

        return {
            success: true,
            original: amount,
            fee,
            feePercent: Math.round(feePercent * 100),
            laundered,
            newCash: Number(user.moneyCash),
            newBank: Number(user.moneyBank),
        };
    }

    async getBalance(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            cash: Number(user.moneyCash),
            bank: Number(user.moneyBank),
            total: Number(user.moneyCash) + Number(user.moneyBank),
        };
    }
}
