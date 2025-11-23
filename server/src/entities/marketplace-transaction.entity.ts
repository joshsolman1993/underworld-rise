import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { MarketplaceListing } from './marketplace-listing.entity';
import { User } from './user.entity';
import { Item } from './item.entity';

@Entity('marketplace_transactions')
export class MarketplaceTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    listingId: string;

    @Column({ type: 'uuid' })
    sellerId: string;

    @Column({ type: 'uuid' })
    buyerId: string;

    @Column({ type: 'int' })
    itemId: number;

    @ManyToOne(() => MarketplaceListing)
    @JoinColumn({ name: 'listingId' })
    listing: MarketplaceListing;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sellerId' })
    seller: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'buyerId' })
    buyer: User;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    transactionFee: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    sellerRevenue: number;

    @CreateDateColumn()
    createdAt: Date;
}
