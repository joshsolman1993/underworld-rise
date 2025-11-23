import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_stats')
export class UserStats {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @OneToOne(() => User, user => user.stats)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: 10 })
    strength: number;

    @Column({ default: 10 })
    defense: number;

    @Column({ default: 10 })
    agility: number;

    @Column({ default: 10 })
    intelligence: number;
}
