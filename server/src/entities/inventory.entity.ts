import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Item } from './item.entity';

@Entity('inventory')
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    itemId: number;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column({ default: false })
    equipped: boolean;

    @Column({ default: 1 })
    quantity: number;
}
