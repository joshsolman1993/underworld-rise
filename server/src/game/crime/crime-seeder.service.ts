import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crime } from '../../entities/crime.entity';

@Injectable()
export class CrimeSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Crime)
        private crimeRepository: Repository<Crime>,
    ) { }

    async onModuleInit() {
        const count = await this.crimeRepository.count();
        if (count === 0) {
            await this.seedCrimes();
        }
    }

    private async seedCrimes() {
        const crimes = [
            {
                name: 'Zsebtolvajlás',
                description: 'Lopj el egy pénztárcát a tömegben.',
                energyCost: 5,
                minMoney: 50,
                maxMoney: 200,
                xpReward: 10,
                difficulty: 10,
                jailChance: 0.05,
                jailTimeMinutes: 15,
                requiredLevel: 1,
            },
            {
                name: 'Bolti lopás',
                description: 'Lopj árut egy kisebb boltból.',
                energyCost: 10,
                minMoney: 100,
                maxMoney: 500,
                xpReward: 25,
                difficulty: 15,
                jailChance: 0.10,
                jailTimeMinutes: 30,
                requiredLevel: 1,
            },
            {
                name: 'Autófeltörés',
                description: 'Törj fel egy autót és lopd el az értékeket.',
                energyCost: 15,
                minMoney: 300,
                maxMoney: 1000,
                xpReward: 50,
                difficulty: 25,
                jailChance: 0.15,
                jailTimeMinutes: 60,
                requiredLevel: 2,
            },
            {
                name: 'Lakásbetörés',
                description: 'Törj be egy lakásba és vidd el az értékeket.',
                energyCost: 25,
                minMoney: 800,
                maxMoney: 2500,
                xpReward: 100,
                difficulty: 40,
                jailChance: 0.20,
                jailTimeMinutes: 120,
                requiredLevel: 3,
            },
            {
                name: 'Fegyveres rablás',
                description: 'Rabolj ki egy benzinkutat fegyverrel.',
                energyCost: 35,
                minMoney: 1500,
                maxMoney: 5000,
                xpReward: 200,
                difficulty: 60,
                jailChance: 0.30,
                jailTimeMinutes: 240,
                requiredLevel: 5,
            },
            {
                name: 'Bankrablás',
                description: 'Rabolj ki egy bankot - a legnagyobb kockázat, legnagyobb jutalom.',
                energyCost: 50,
                minMoney: 5000,
                maxMoney: 15000,
                xpReward: 500,
                difficulty: 100,
                jailChance: 0.40,
                jailTimeMinutes: 480,
                requiredLevel: 10,
            },
        ];

        await this.crimeRepository.save(crimes);
        console.log('✅ Crimes seeded successfully');
    }
}
