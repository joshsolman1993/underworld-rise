import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Mission } from './mission.entity';

@Entity('user_missions')
export class UserMission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    missionId: number;

    @ManyToOne(() => Mission)
    @JoinColumn({ name: 'missionId' })
    mission: Mission;

    @Column({ default: 0 })
    progress: number;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ default: false })
    isClaimed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
