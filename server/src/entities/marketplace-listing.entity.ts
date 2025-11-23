import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Item } from './item.entity';

export enum ListingStatus {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
}

@Entity('marketplace_listings')
export class MarketplaceListing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    sellerId: string;

    @Column({ type: 'int' })
    itemId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sellerId' })
    seller: User;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    listingFee: number;

    @Column({
        type: 'enum',
        enum: ListingStatus,
        default: ListingStatus.ACTIVE,
    })
    status: ListingStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    soldAt: Date;

    @Column({ type: 'uuid', nullable: true })
    buyerId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'buyerId' })
    buyer: User;
}
