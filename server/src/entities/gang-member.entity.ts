import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Gang } from './gang.entity';

export enum GangMemberRole {
    LEADER = 'leader',
    OFFICER = 'officer',
    MEMBER = 'member',
}

@Entity('gang_members')
export class GangMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    gangId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => Gang)
    @JoinColumn({ name: 'gangId' })
    gang: Gang;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({
        type: 'enum',
        enum: GangMemberRole,
        default: GangMemberRole.MEMBER,
    })
    role: GangMemberRole;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    contributedMoney: number;

    @CreateDateColumn()
    joinedAt: Date;
}
