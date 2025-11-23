import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MissionService } from './mission.service';

@Controller('missions')
@UseGuards(JwtAuthGuard)
export class MissionController {
    constructor(private readonly missionService: MissionService) { }

    @Get()
    async getMyMissions(@Request() req) {
        return this.missionService.getMyMissions(req.user.id);
    }

    @Post(':id/claim')
    async claimReward(@Request() req, @Param('id') id: string) {
        return this.missionService.claimReward(req.user.id, id);
    }
}
