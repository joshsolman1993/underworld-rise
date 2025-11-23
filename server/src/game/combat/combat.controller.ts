import { Controller, Post, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CombatService } from './combat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('combat')
@UseGuards(JwtAuthGuard)
export class CombatController {
    constructor(private combatService: CombatService) { }

    @Get('players')
    async getOnlinePlayers(@Request() req) {
        return this.combatService.getOnlinePlayers(req.user.sub);
    }

    @Post('attack/:defenderId')
    async attack(@Request() req, @Param('defenderId') defenderId: string) {
        return this.combatService.attack(req.user.sub, defenderId);
    }

    @Get('history')
    async getCombatHistory(@Request() req, @Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit) : 20;
        return this.combatService.getCombatHistory(req.user.sub, limitNum);
    }
}
