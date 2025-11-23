import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('crimes')
export class Crime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    energyCost: number;

    @Column()
    minMoney: number;

    @Column()
    maxMoney: number;

    @Column()
    xpReward: number;

    @Column()
    difficulty: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    jailChance: number;

    @Column()
    jailTimeMinutes: number;

    @Column({ default: 1 })
    requiredLevel: number;
}
