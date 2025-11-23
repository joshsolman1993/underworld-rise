import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Drug } from './drug.entity';

@Entity('user_drugs')
export class UserDrug {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    drugId: number;

    @ManyToOne(() => Drug)
    @JoinColumn({ name: 'drugId' })
    drug: Drug;

    @Column({ default: 0 })
    quantity: number;

    @UpdateDateColumn()
    updatedAt: Date;
}
