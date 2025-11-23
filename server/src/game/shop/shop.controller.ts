import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('shop')
@UseGuards(JwtAuthGuard)
export class ShopController {
    constructor(private shopService: ShopService) { }

    @Get('items')
    async getAllItems() {
        return this.shopService.getAllItems();
    }

    @Post('purchase/:itemId')
    async purchaseItem(@Request() req, @Param('itemId') itemId: string) {
        return this.shopService.purchaseItem(req.user.sub, parseInt(itemId));
    }

    @Get('inventory')
    async getUserInventory(@Request() req) {
        return this.shopService.getUserInventory(req.user.sub);
    }

    @Post('equip/:inventoryId')
    async equipItem(@Request() req, @Param('inventoryId') inventoryId: string) {
        return this.shopService.equipItem(req.user.sub, inventoryId);
    }
}
