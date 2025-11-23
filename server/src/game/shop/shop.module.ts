import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ItemSeederService } from './item-seeder.service';
import { Item } from '../../entities/item.entity';
import { User } from '../../entities/user.entity';
import { Inventory } from '../../entities/inventory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item, User, Inventory])],
    controllers: [ShopController],
    providers: [ShopService, ItemSeederService],
    exports: [ShopService],
})
export class ShopModule { }
