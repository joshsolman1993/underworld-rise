import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MissionType {
    STORY = 'STORY',
    DAILY = 'DAILY',
}

export enum MissionRequirementType {
    CRIME = 'CRIME',
    COMBAT = 'COMBAT',
    GYM = 'GYM',
    ITEM = 'ITEM',
}

@Entity('missions')
export class Mission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: MissionType,
        default: MissionType.STORY
    })
    type: MissionType;

    @Column({
        type: 'enum',
        enum: MissionRequirementType,
    })
    requirementType: MissionRequirementType;

    @Column()
    requirementValue: number;

    @Column({ nullable: true })
    requirementTarget: string; // ID of specific crime/item, or null for any

    @Column({ default: 0 })
    rewardXp: number;

    @Column({ default: 0 })
    rewardMoney: number;

    @Column({ default: 0 })
    rewardCredits: number;

    @Column({ default: 1 })
    minLevel: number;

    @Column({ default: 0 })
    order: number; // For story missions sequence

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
