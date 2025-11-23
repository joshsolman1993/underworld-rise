import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
    constructor(private marketplaceService: MarketplaceService) { }

    @Post('list')
    async createListing(
        @Request() req,
        @Body() body: { inventoryId: string; price: number },
    ) {
        return this.marketplaceService.createListing(req.user.sub, body.inventoryId, body.price);
    }

    @Delete('list/:listingId')
    async cancelListing(@Request() req, @Param('listingId') listingId: string) {
        return this.marketplaceService.cancelListing(req.user.sub, listingId);
    }

    @Get('listings')
    async getActiveListings(
        @Query('type') type?: string,
        @Query('sort') sort?: string,
        @Query('page') page?: string,
    ) {
        return this.marketplaceService.getActiveListings(type, sort, page ? parseInt(page) : 1);
    }

    @Get('listing/:listingId')
    async getListing(@Param('listingId') listingId: string) {
        return this.marketplaceService.getListing(listingId);
    }

    @Post('buy/:listingId')
    async buyListing(@Request() req, @Param('listingId') listingId: string) {
        return this.marketplaceService.buyListing(req.user.sub, listingId);
    }

    @Get('my-listings')
    async getMyListings(@Request() req) {
        return this.marketplaceService.getMyListings(req.user.sub);
    }

    @Get('my-sales')
    async getMySales(@Request() req) {
        return this.marketplaceService.getMySales(req.user.sub);
    }

    @Get('my-purchases')
    async getMyPurchases(@Request() req) {
        return this.marketplaceService.getMyPurchases(req.user.sub);
    }
}
