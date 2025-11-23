import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum CombatResult {
    ATTACKER_WIN = 'attacker_win',
    DEFENDER_WIN = 'defender_win',
    DRAW = 'draw',
}

@Entity('combat_logs')
export class CombatLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    attackerId: string;

    @Column({ type: 'uuid' })
    defenderId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'attackerId' })
    attacker: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'defenderId' })
    defender: User;

    @Column({
        type: 'enum',
        enum: CombatResult,
    })
    result: CombatResult;

    @Column()
    attackerDamageDealt: number;

    @Column()
    defenderDamageDealt: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    moneyStolen: number;

    @Column()
    xpGained: number;

    @CreateDateColumn()
    createdAt: Date;
}
