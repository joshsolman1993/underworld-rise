import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drug, DrugTrend } from '../../entities/drug.entity';

@Injectable()
export class DrugSeederService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Drug)
        private drugRepository: Repository<Drug>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedDrugs();
    }

    private async seedDrugs() {
        const count = await this.drugRepository.count();
        if (count > 0) return;

        const drugs = [
            {
                name: 'Weed',
                description: 'Common street herb. Low risk, low reward.',
                basePrice: 50,
                minPrice: 30,
                maxPrice: 80,
                currentPrice: 50,
                volatility: 0.2, // 20% swings
            },
            {
                name: 'Ecstasy',
                description: 'Party pills. Popular in clubs.',
                basePrice: 150,
                minPrice: 100,
                maxPrice: 250,
                currentPrice: 150,
                volatility: 0.25,
            },
            {
                name: 'Speed',
                description: 'Keeps you awake for days.',
                basePrice: 300,
                minPrice: 200,
                maxPrice: 500,
                currentPrice: 300,
                volatility: 0.3,
            },
            {
                name: 'Cocaine',
                description: 'Rich man\'s powder. High value.',
                basePrice: 1000,
                minPrice: 700,
                maxPrice: 1500,
                currentPrice: 1000,
                volatility: 0.35,
            },
            {
                name: 'Blue Crystal',
                description: 'The purest product on the market.',
                basePrice: 2500,
                minPrice: 1500,
                maxPrice: 4000,
                currentPrice: 2500,
                volatility: 0.4,
            },
        ];

        for (const drug of drugs) {
            await this.drugRepository.save(this.drugRepository.create({
                ...drug,
                trend: DrugTrend.STABLE,
            }));
        }

        console.log('✅ Seeded initial drugs');
    }
}
