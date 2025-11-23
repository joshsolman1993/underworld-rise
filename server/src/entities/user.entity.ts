import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { UserStats } from './user-stats.entity';
import { Gang } from './gang.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    username: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    passwordHash: string;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    xp: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 500 })
    moneyCash: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    moneyBank: number;

    @Column({ default: 0 })
    credits: number;

    @Column({ default: 100 })
    health: number;

    @Column({ default: 100 })
    energy: number;

    @Column({ default: 100 })
    nerve: number;

    @Column({ default: 100 })
    willpower: number;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ default: false })
    isBanned: boolean;

    @Column({ type: 'timestamp', nullable: true })
    bannedUntil: Date;

    @Column({ type: 'text', nullable: true })
    bannedReason: string;

    @Column({ type: 'timestamp', nullable: true })
    prisonReleaseTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    hospitalReleaseTime: Date;

    @Column({ type: 'uuid', nullable: true })
    gangId: string;

    @ManyToOne(() => Gang, { nullable: true })
    @JoinColumn({ name: 'gangId' })
    gang: Gang;

    @OneToOne(() => UserStats, stats => stats.user, { cascade: true })
    stats: UserStats;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastEnergyUpdate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastNerveUpdate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastWillpowerUpdate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastHealthUpdate: Date;
}
