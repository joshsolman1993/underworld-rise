import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOR = 'ARMOR',
    VEHICLE = 'VEHICLE',
    CONSUMABLE = 'CONSUMABLE',
}

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ItemType,
    })
    type: ItemType;

    @Column({ length: 50, nullable: true })
    effectStat: string;

    @Column({ default: 0 })
    effectValue: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    price: number;

    @Column({ default: true })
    isTradable: boolean;

    @Column({ default: 1 })
    requiredLevel: number;
}
