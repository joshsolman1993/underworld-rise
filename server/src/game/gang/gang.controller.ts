import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GangService } from './gang.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('gang')
@UseGuards(JwtAuthGuard)
export class GangController {
    constructor(private gangService: GangService) { }

    @Post('create')
    async createGang(
        @Request() req,
        @Body() body: { name: string; tag: string },
    ) {
        return this.gangService.createGang(req.user.sub, body.name, body.tag);
    }

    @Get('my')
    async getMyGang(@Request() req) {
        return this.gangService.getMyGang(req.user.sub);
    }

    @Get('all')
    async getAllGangs() {
        return this.gangService.getAllGangs();
    }

    @Get(':id')
    async getGang(@Param('id') id: string) {
        return this.gangService.getGang(id);
    }

    @Post(':id/invite/:userId')
    async inviteMember(
        @Request() req,
        @Param('id') gangId: string,
        @Param('userId') userId: string,
    ) {
        return this.gangService.inviteMember(gangId, req.user.sub, userId);
    }

    @Delete(':id/kick/:userId')
    async kickMember(
        @Request() req,
        @Param('id') gangId: string,
        @Param('userId') userId: string,
    ) {
        return this.gangService.kickMember(gangId, req.user.sub, userId);
    }

    @Post('leave')
    async leaveGang(@Request() req) {
        return this.gangService.leaveGang(req.user.sub);
    }

    @Delete(':id/disband')
    async disbandGang(@Request() req, @Param('id') gangId: string) {
        return this.gangService.disbandGang(gangId, req.user.sub);
    }

    @Post(':id/deposit')
    async depositToTreasury(
        @Request() req,
        @Param('id') gangId: string,
        @Body() body: { amount: number },
    ) {
        return this.gangService.depositToTreasury(gangId, req.user.sub, body.amount);
    }
}
