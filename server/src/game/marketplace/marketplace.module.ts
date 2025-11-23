import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceListing } from '../../entities/marketplace-listing.entity';
import { MarketplaceTransaction } from '../../entities/marketplace-transaction.entity';
import { User } from '../../entities/user.entity';
import { Inventory } from '../../entities/inventory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MarketplaceListing, MarketplaceTransaction, User, Inventory])],
    controllers: [MarketplaceController],
    providers: [MarketplaceService],
    exports: [MarketplaceService],
})
export class MarketplaceModule { }
