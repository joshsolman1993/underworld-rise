import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { BankService } from './bank.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('bank')
@UseGuards(JwtAuthGuard)
export class BankController {
    constructor(private bankService: BankService) { }

    @Get('balance')
    async getBalance(@Request() req) {
        return this.bankService.getBalance(req.user.sub);
    }

    @Post('deposit')
    async deposit(@Request() req, @Body() body: { amount: number }) {
        return this.bankService.deposit(req.user.sub, body.amount);
    }

    @Post('withdraw')
    async withdraw(@Request() req, @Body() body: { amount: number }) {
        return this.bankService.withdraw(req.user.sub, body.amount);
    }

    @Post('launder')
    async launderMoney(@Request() req, @Body() body: { amount: number }) {
        return this.bankService.launderMoney(req.user.sub, body.amount);
    }
}
