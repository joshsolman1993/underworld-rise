import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { GangMember } from './gang-member.entity';

@Entity('gangs')
export class Gang {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 100 })
    name: string;

    @Column({ unique: true, length: 10 })
    tag: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'uuid' })
    leaderId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'leaderId' })
    leader: User;

    @OneToMany(() => GangMember, member => member.gang)
    members: GangMember[];

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    treasury: number;

    @Column({ default: 0 })
    reputation: number;

    @CreateDateColumn()
    createdAt: Date;
}
