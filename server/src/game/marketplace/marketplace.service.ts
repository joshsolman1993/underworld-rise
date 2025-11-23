import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceListing, ListingStatus } from '../../entities/marketplace-listing.entity';
import { MarketplaceTransaction } from '../../entities/marketplace-transaction.entity';
import { User } from '../../entities/user.entity';
import { Inventory } from '../../entities/inventory.entity';

@Injectable()
export class MarketplaceService {
    constructor(
        @InjectRepository(MarketplaceListing)
        private listingRepository: Repository<MarketplaceListing>,
        @InjectRepository(MarketplaceTransaction)
        private transactionRepository: Repository<MarketplaceTransaction>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
        private configService: ConfigService,
    ) { }

    async createListing(userId: string, inventoryId: string, price: number) {
        const minPrice = this.configService.get<number>('MARKETPLACE_MIN_PRICE') || 100;
        const listingFeePercent = this.configService.get<number>('MARKETPLACE_LISTING_FEE_PERCENT') || 0.05;
        const maxListings = this.configService.get<number>('MARKETPLACE_MAX_LISTINGS_PER_USER') || 10;
        const durationDays = this.configService.get<number>('MARKETPLACE_LISTING_DURATION_DAYS') || 7;

        // Validate price
        if (price < minPrice) {
            throw new BadRequestException(`Minimum price is $${minPrice}`);
        }

        // Get user
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user is in prison or hospital
        if (user.prisonReleaseTime && new Date(user.prisonReleaseTime) > new Date()) {
            throw new BadRequestException('Cannot list items while in prison');
        }
        if (user.hospitalReleaseTime && new Date(user.hospitalReleaseTime) > new Date()) {
            throw new BadRequestException('Cannot list items while in hospital');
        }

        // Check active listings count
        const activeListingsCount = await this.listingRepository.count({
            where: { sellerId: userId, status: ListingStatus.ACTIVE },
        });

        if (activeListingsCount >= maxListings) {
            throw new BadRequestException(`Maximum ${maxListings} active listings allowed`);
        }

        // Get inventory item
        const inventoryItem = await this.inventoryRepository.findOne({
            where: { id: inventoryId, userId },
            relations: ['item'],
        });

        if (!inventoryItem) {
            throw new NotFoundException('Item not found in inventory');
        }

        // Check if item is equipped
        if (inventoryItem.equipped) {
            throw new BadRequestException('Cannot list equipped items');
        }

        // Calculate listing fee
        const listingFee = Math.max(5, price * listingFeePercent);

        // Check if user has enough cash for listing fee
        if (Number(user.moneyCash) < listingFee) {
            throw new BadRequestException('Not enough cash for listing fee');
        }

        // Deduct listing fee
        user.moneyCash = Number(user.moneyCash) - listingFee;
        await this.userRepository.save(user);

        // Remove item from inventory
        await this.inventoryRepository.remove(inventoryItem);

        // Create listing
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        const listing = this.listingRepository.create({
            sellerId: userId,
            itemId: inventoryItem.itemId,
            price,
            listingFee,
            status: ListingStatus.ACTIVE,
            expiresAt,
        });

        await this.listingRepository.save(listing);

        return listing;
    }

    async cancelListing(userId: string, listingId: string) {
        const listing = await this.listingRepository.findOne({
            where: { id: listingId },
            relations: ['item'],
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.sellerId !== userId) {
            throw new ForbiddenException('You can only cancel your own listings');
        }

        if (listing.status !== ListingStatus.ACTIVE) {
            throw new BadRequestException('Listing is not active');
        }

        // Update listing status
        listing.status = ListingStatus.CANCELLED;
        await this.listingRepository.save(listing);

        // Return item to inventory
        const inventoryItem = this.inventoryRepository.create({
            userId,
            itemId: listing.itemId,
            quantity: 1,
            equipped: false,
        });

        await this.inventoryRepository.save(inventoryItem);

        return { message: 'Listing cancelled successfully' };
    }

    async getActiveListings(type?: string, sort?: string, page: number = 1, limit: number = 20) {
        const query = this.listingRepository
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.item', 'item')
            .leftJoinAndSelect('listing.seller', 'seller')
            .where('listing.status = :status', { status: ListingStatus.ACTIVE })
            .andWhere('listing.expiresAt > :now', { now: new Date() });

        // Filter by type
        if (type) {
            query.andWhere('item.type = :type', { type });
        }

        // Sort
        switch (sort) {
            case 'price_asc':
                query.orderBy('listing.price', 'ASC');
                break;
            case 'price_desc':
                query.orderBy('listing.price', 'DESC');
                break;
            case 'date_desc':
                query.orderBy('listing.createdAt', 'DESC');
                break;
            default:
                query.orderBy('listing.createdAt', 'DESC');
        }

        // Pagination
        query.skip((page - 1) * limit).take(limit);

        const [listings, total] = await query.getManyAndCount();

        return {
            listings,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getListing(listingId: string) {
        const listing = await this.listingRepository.findOne({
            where: { id: listingId },
            relations: ['item', 'seller'],
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        return listing;
    }

    async buyListing(userId: string, listingId: string) {
        const transactionFeePercent = this.configService.get<number>('MARKETPLACE_TRANSACTION_FEE_PERCENT') || 0.10;

        const listing = await this.listingRepository.findOne({
            where: { id: listingId },
            relations: ['item', 'seller'],
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.status !== ListingStatus.ACTIVE) {
            throw new BadRequestException('Listing is not active');
        }

        if (listing.expiresAt < new Date()) {
            throw new BadRequestException('Listing has expired');
        }

        if (listing.sellerId === userId) {
            throw new BadRequestException('Cannot buy your own listing');
        }

        // Get buyer
        const buyer = await this.userRepository.findOne({ where: { id: userId } });
        if (!buyer) {
            throw new NotFoundException('Buyer not found');
        }

        // Check if buyer has enough cash
        const listingPrice = Number(listing.price);
        if (Number(buyer.moneyCash) < listingPrice) {
            throw new BadRequestException('Not enough cash');
        }

        // Get seller
        const seller = await this.userRepository.findOne({ where: { id: listing.sellerId } });
        if (!seller) {
            throw new NotFoundException('Seller not found');
        }

        // Calculate fees
        const transactionFee = listingPrice * transactionFeePercent;
        const sellerRevenue = listingPrice - transactionFee;

        // Transfer money
        buyer.moneyCash = Number(buyer.moneyCash) - listingPrice;
        seller.moneyCash = Number(seller.moneyCash) + sellerRevenue;

        await this.userRepository.save(buyer);
        await this.userRepository.save(seller);

        // Transfer item to buyer
        const inventoryItem = this.inventoryRepository.create({
            userId,
            itemId: listing.itemId,
            quantity: 1,
            equipped: false,
        });

        await this.inventoryRepository.save(inventoryItem);

        // Update listing
        listing.status = ListingStatus.SOLD;
        listing.soldAt = new Date();
        listing.buyerId = userId;
        await this.listingRepository.save(listing);

        // Create transaction record
        const transaction = this.transactionRepository.create({
            listingId,
            sellerId: listing.sellerId,
            buyerId: userId,
            itemId: listing.itemId,
            price: listingPrice,
            transactionFee,
            sellerRevenue,
        });

        await this.transactionRepository.save(transaction);

        return {
            message: 'Purchase successful',
            transaction,
        };
    }

    async getMyListings(userId: string) {
        const listings = await this.listingRepository.find({
            where: { sellerId: userId },
            relations: ['item'],
            order: { createdAt: 'DESC' },
        });

        return listings;
    }

    async getMySales(userId: string) {
        const transactions = await this.transactionRepository.find({
            where: { sellerId: userId },
            relations: ['item', 'buyer'],
            order: { createdAt: 'DESC' },
        });

        return transactions;
    }

    async getMyPurchases(userId: string) {
        const transactions = await this.transactionRepository.find({
            where: { buyerId: userId },
            relations: ['item', 'seller'],
            order: { createdAt: 'DESC' },
        });

        return transactions;
    }

    // Cron job to expire old listings
    @Cron(CronExpression.EVERY_HOUR)
    async expireOldListings() {
        const expiredListings = await this.listingRepository.find({
            where: {
                status: ListingStatus.ACTIVE,
                expiresAt: LessThan(new Date()),
            },
            relations: ['item'],
        });

        for (const listing of expiredListings) {
            // Update status
            listing.status = ListingStatus.EXPIRED;
            await this.listingRepository.save(listing);

            // Return item to seller's inventory
            const inventoryItem = this.inventoryRepository.create({
                userId: listing.sellerId,
                itemId: listing.itemId,
                quantity: 1,
                equipped: false,
            });

            await this.inventoryRepository.save(inventoryItem);
        }

        if (expiredListings.length > 0) {
            console.log(`✅ Expired ${expiredListings.length} marketplace listings`);
        }
    }
}
