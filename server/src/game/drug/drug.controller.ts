import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DrugService } from './drug.service';

@Controller('drugs')
@UseGuards(JwtAuthGuard)
export class DrugController {
    constructor(private readonly drugService: DrugService) { }

    @Get()
    async getAllDrugs() {
        return this.drugService.getAllDrugs();
    }

    @Get('inventory')
    async getUserDrugs(@Request() req) {
        return this.drugService.getUserDrugs(req.user.id);
    }

    @Post('buy')
    async buyDrug(@Request() req, @Body() body: { drugId: number; quantity: number }) {
        return this.drugService.buyDrug(req.user.id, body.drugId, body.quantity);
    }

    @Post('sell')
    async sellDrug(@Request() req, @Body() body: { drugId: number; quantity: number }) {
        return this.drugService.sellDrug(req.user.id, body.drugId, body.quantity);
    }
}
