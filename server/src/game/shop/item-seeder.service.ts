import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, ItemType } from '../../entities/item.entity';

@Injectable()
export class ItemSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    async onModuleInit() {
        const count = await this.itemRepository.count();
        if (count === 0) {
            await this.seedItems();
        }
    }

    private async seedItems() {
        const items = [
            // Weapons
            {
                name: 'Baseball Bat',
                description: 'A wooden bat for street fights.',
                type: ItemType.WEAPON,
                effectStat: 'strength',
                effectValue: 5,
                price: 500,
                isTradable: true,
                requiredLevel: 1,
            },
            {
                name: 'Switchblade',
                description: 'A small but deadly knife.',
                type: ItemType.WEAPON,
                effectStat: 'strength',
                effectValue: 10,
                price: 1200,
                isTradable: true,
                requiredLevel: 2,
            },
            {
                name: 'Pistol',
                description: '9mm handgun for serious business.',
                type: ItemType.WEAPON,
                effectStat: 'strength',
                effectValue: 25,
                price: 5000,
                isTradable: true,
                requiredLevel: 5,
            },
            {
                name: 'Shotgun',
                description: 'Pump-action shotgun with devastating power.',
                type: ItemType.WEAPON,
                effectStat: 'strength',
                effectValue: 50,
                price: 15000,
                isTradable: true,
                requiredLevel: 10,
            },

            // Armor
            {
                name: 'Leather Jacket',
                description: 'Basic protection from attacks.',
                type: ItemType.ARMOR,
                effectStat: 'defense',
                effectValue: 5,
                price: 800,
                isTradable: true,
                requiredLevel: 1,
            },
            {
                name: 'Kevlar Vest',
                description: 'Bulletproof vest for serious protection.',
                type: ItemType.ARMOR,
                effectStat: 'defense',
                effectValue: 20,
                price: 8000,
                isTradable: true,
                requiredLevel: 5,
            },
            {
                name: 'Body Armor',
                description: 'Military-grade body armor.',
                type: ItemType.ARMOR,
                effectStat: 'defense',
                effectValue: 40,
                price: 20000,
                isTradable: true,
                requiredLevel: 10,
            },

            // Vehicles
            {
                name: 'Motorcycle',
                description: 'Fast bike for quick getaways.',
                type: ItemType.VEHICLE,
                effectStat: 'agility',
                effectValue: 10,
                price: 10000,
                isTradable: true,
                requiredLevel: 3,
            },
            {
                name: 'Sports Car',
                description: 'High-speed car for racing and escapes.',
                type: ItemType.VEHICLE,
                effectStat: 'agility',
                effectValue: 30,
                price: 50000,
                isTradable: true,
                requiredLevel: 8,
            },

            // Consumables
            {
                name: 'Energy Drink',
                description: 'Restores 20 energy.',
                type: ItemType.CONSUMABLE,
                effectStat: 'energy',
                effectValue: 20,
                price: 100,
                isTradable: true,
                requiredLevel: 1,
            },
            {
                name: 'First Aid Kit',
                description: 'Restores 50 health.',
                type: ItemType.CONSUMABLE,
                effectStat: 'health',
                effectValue: 50,
                price: 500,
                isTradable: true,
                requiredLevel: 1,
            },
        ];

        await this.itemRepository.save(items);
        console.log('✅ Items seeded successfully');
    }
}
