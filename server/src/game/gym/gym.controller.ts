import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { GymService, TrainingStat } from './gym.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('gym')
@UseGuards(JwtAuthGuard)
export class GymController {
    constructor(private gymService: GymService) { }

    @Get('costs')
    async getTrainingCosts(@Request() req) {
        return this.gymService.getTrainingCosts(req.user.sub);
    }

    @Post('train')
    async train(@Request() req, @Body() body: { stat: TrainingStat }) {
        return this.gymService.train(req.user.sub, body.stat);
    }
}
