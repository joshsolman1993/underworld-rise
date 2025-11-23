import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../entities/item.entity';
import { User } from '../../entities/user.entity';
import { Inventory } from '../../entities/inventory.entity';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) { }

    async getAllItems() {
        return this.itemRepository.find({
            order: { requiredLevel: 'ASC', price: 'ASC' },
        });
    }

    async purchaseItem(userId: string, itemId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const item = await this.itemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException('Item not found');
        }

        // Check level requirement
        if (user.level < item.requiredLevel) {
            throw new BadRequestException(`You need to be level ${item.requiredLevel} to buy this item`);
        }

        // Check money
        if (Number(user.moneyCash) < Number(item.price)) {
            throw new BadRequestException('Not enough cash');
        }

        // Deduct money
        user.moneyCash = Number(user.moneyCash) - Number(item.price);
        await this.userRepository.save(user);

        // Check if user already has this item
        const existingInventory = await this.inventoryRepository.findOne({
            where: { userId, itemId },
        });

        if (existingInventory) {
            // Increase quantity
            existingInventory.quantity += 1;
            await this.inventoryRepository.save(existingInventory);
        } else {
            // Create new inventory entry
            const inventory = this.inventoryRepository.create({
                userId,
                itemId,
                quantity: 1,
                equipped: false,
            });
            await this.inventoryRepository.save(inventory);
        }

        return {
            success: true,
            item: item.name,
            price: Number(item.price),
            newCash: Number(user.moneyCash),
        };
    }

    async getUserInventory(userId: string) {
        const inventory = await this.inventoryRepository.find({
            where: { userId },
            relations: ['item'],
        });

        return inventory;
    }

    async equipItem(userId: string, inventoryId: string) {
        const inventory = await this.inventoryRepository.findOne({
            where: { id: inventoryId, userId },
            relations: ['item'],
        });

        if (!inventory) {
            throw new NotFoundException('Item not found in inventory');
        }

        // Unequip other items of the same type
        const sameTypeItems = await this.inventoryRepository.find({
            where: { userId },
            relations: ['item'],
        });

        for (const item of sameTypeItems) {
            if (item.item.type === inventory.item.type && item.equipped) {
                item.equipped = false;
                await this.inventoryRepository.save(item);
            }
        }

        // Equip this item
        inventory.equipped = true;
        await this.inventoryRepository.save(inventory);

        return {
            success: true,
            equipped: inventory.item.name,
        };
    }
}
