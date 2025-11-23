import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export enum DrugTrend {
    UP = 'UP',
    DOWN = 'DOWN',
    STABLE = 'STABLE',
}

@Entity('drugs')
export class Drug {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    basePrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    minPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    maxPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    currentPrice: number;

    @Column({ type: 'float', default: 0.15 })
    volatility: number; // 0.15 = 15% max change

    @Column({
        type: 'enum',
        enum: DrugTrend,
        default: DrugTrend.STABLE
    })
    trend: DrugTrend;

    @UpdateDateColumn()
    lastPriceUpdate: Date;
}
