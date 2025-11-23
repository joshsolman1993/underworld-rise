import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { CrimeService } from './crime.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('crimes')
@UseGuards(JwtAuthGuard)
export class CrimeController {
    constructor(private crimeService: CrimeService) { }

    @Get()
    async getAllCrimes() {
        return this.crimeService.getAllCrimes();
    }

    @Post(':id/commit')
    async commitCrime(@Request() req, @Param('id') crimeId: string) {
        return this.crimeService.commitCrime(req.user.sub, parseInt(crimeId));
    }
}
