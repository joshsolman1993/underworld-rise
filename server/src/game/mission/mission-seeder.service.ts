import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission, MissionType, MissionRequirementType } from '../../entities/mission.entity';

@Injectable()
export class MissionSeederService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Mission)
        private missionRepository: Repository<Mission>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedMissions();
    }

    private async seedMissions() {
        const count = await this.missionRepository.count();
        if (count > 0) return;

        const missions = [
            // Story Missions
            {
                title: 'First Steps',
                description: 'Welcome to the underworld. Prove your worth by committing your first crime.',
                type: MissionType.STORY,
                requirementType: MissionRequirementType.CRIME,
                requirementValue: 1,
                rewardXp: 100,
                rewardMoney: 500,
                order: 1,
            },
            {
                title: 'Getting Stronger',
                description: 'You need to be tough to survive. Train at the gym 5 times.',
                type: MissionType.STORY,
                requirementType: MissionRequirementType.GYM,
                requirementValue: 5,
                rewardXp: 200,
                rewardMoney: 1000,
                order: 2,
            },
            {
                title: 'Street Fight',
                description: 'Show them who is boss. Win 3 fights against other players.',
                type: MissionType.STORY,
                requirementType: MissionRequirementType.COMBAT,
                requirementValue: 3,
                rewardXp: 500,
                rewardMoney: 2500,
                order: 3,
            },

            // Daily Missions
            {
                title: 'Daily Grind',
                description: 'Commit 10 crimes today.',
                type: MissionType.DAILY,
                requirementType: MissionRequirementType.CRIME,
                requirementValue: 10,
                rewardXp: 150,
                rewardMoney: 1000,
            },
            {
                title: 'Gym Rat',
                description: 'Train 10 times at the gym today.',
                type: MissionType.DAILY,
                requirementType: MissionRequirementType.GYM,
                requirementValue: 10,
                rewardXp: 150,
                rewardMoney: 500,
            },
            {
                title: 'Brawler',
                description: 'Win 5 fights today.',
                type: MissionType.DAILY,
                requirementType: MissionRequirementType.COMBAT,
                requirementValue: 5,
                rewardXp: 300,
                rewardMoney: 2000,
            },
        ];

        for (const mission of missions) {
            await this.missionRepository.save(this.missionRepository.create(mission));
        }

        console.log('✅ Seeded initial missions');
    }
}
