import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { UpdateUserStatsDto, GiveResourcesDto, BanUserDto, CreateCrimeDto, UpdateCrimeDto, CreateItemDto, UpdateItemDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // ==================== USER MANAGEMENT ====================

    @Get('users')
    async getAllUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getAllUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    @Patch('users/:id/ban')
    async banUser(@Param('id') userId: string, @Body() banDto: BanUserDto) {
        return this.adminService.banUser(userId, banDto);
    }

    @Patch('users/:id/unban')
    async unbanUser(@Param('id') userId: string) {
        return this.adminService.unbanUser(userId);
    }

    @Patch('users/:id/stats')
    async updateUserStats(@Param('id') userId: string, @Body() statsDto: UpdateUserStatsDto) {
        return this.adminService.updateUserStats(userId, statsDto);
    }

    @Patch('users/:id/resources')
    async giveResources(@Param('id') userId: string, @Body() resourcesDto: GiveResourcesDto) {
        return this.adminService.giveResources(userId, resourcesDto);
    }

    @Delete('users/:id')
    async deleteUser(@Param('id') userId: string) {
        return this.adminService.deleteUser(userId);
    }

    // ==================== SYSTEM STATISTICS ====================

    @Get('stats')
    async getSystemStats() {
        return this.adminService.getSystemStats();
    }

    // ==================== CRIME MANAGEMENT ====================

    @Get('crimes')
    async getAllCrimes() {
        return this.adminService.getAllCrimes();
    }

    @Post('crimes')
    async createCrime(@Body() crimeDto: CreateCrimeDto) {
        return this.adminService.createCrime(crimeDto);
    }

    @Patch('crimes/:id')
    async updateCrime(@Param('id') crimeId: string, @Body() crimeDto: UpdateCrimeDto) {
        return this.adminService.updateCrime(parseInt(crimeId), crimeDto);
    }

    @Delete('crimes/:id')
    async deleteCrime(@Param('id') crimeId: string) {
        return this.adminService.deleteCrime(parseInt(crimeId));
    }

    // ==================== ITEM MANAGEMENT ====================

    @Get('items')
    async getAllItems() {
        return this.adminService.getAllItems();
    }

    @Post('items')
    async createItem(@Body() itemDto: CreateItemDto) {
        return this.adminService.createItem(itemDto);
    }

    @Patch('items/:id')
    async updateItem(@Param('id') itemId: string, @Body() itemDto: UpdateItemDto) {
        return this.adminService.updateItem(parseInt(itemId), itemDto);
    }

    @Delete('items/:id')
    async deleteItem(@Param('id') itemId: string) {
        return this.adminService.deleteItem(parseInt(itemId));
    }

    // ==================== GANG MANAGEMENT ====================

    @Get('gangs')
    async getAllGangs() {
        return this.adminService.getAllGangs();
    }

    @Delete('gangs/:id')
    async disbandGang(@Param('id') gangId: string) {
        return this.adminService.disbandGang(gangId);
    }

    @Patch('gangs/:id/treasury')
    async updateGangTreasury(@Param('id') gangId: string, @Body('amount') amount: number) {
        return this.adminService.updateGangTreasury(gangId, amount);
    }
}
