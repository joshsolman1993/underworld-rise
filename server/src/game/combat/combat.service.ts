import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CombatLog, CombatResult } from '../../entities/combat-log.entity';
import { Inventory } from '../../entities/inventory.entity';
import { EventsGateway } from '../../events/events.gateway';

@Injectable()
export class CombatService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(CombatLog)
        private combatLogRepository: Repository<CombatLog>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
        private eventsGateway: EventsGateway,
    ) { }

    async attack(attackerId: string, defenderId: string) {
        // Get attacker and defender with stats
        const attacker = await this.userRepository.findOne({
            where: { id: attackerId },
            relations: ['stats'],
        });

        const defender = await this.userRepository.findOne({
            where: { id: defenderId },
            relations: ['stats'],
        });

        if (!attacker) {
            throw new NotFoundException('Attacker not found');
        }

        if (!defender) {
            throw new NotFoundException('Defender not found');
        }

        // Cannot attack yourself
        if (attackerId === defenderId) {
            throw new BadRequestException('You cannot attack yourself');
        }

        // Check if attacker is in prison or hospital
        if (attacker.prisonReleaseTime && new Date(attacker.prisonReleaseTime) > new Date()) {
            throw new BadRequestException('You are in prison');
        }

        if (attacker.hospitalReleaseTime && new Date(attacker.hospitalReleaseTime) > new Date()) {
            throw new BadRequestException('You are in hospital');
        }

        // Check nerve
        const nerveCost = 10;
        if (attacker.nerve < nerveCost) {
            throw new BadRequestException('Not enough nerve');
        }

        // Check if defender is online (not in prison/hospital)
        const defenderInPrison = defender.prisonReleaseTime && new Date(defender.prisonReleaseTime) > new Date();
        const defenderInHospital = defender.hospitalReleaseTime && new Date(defender.hospitalReleaseTime) > new Date();

        if (defenderInPrison || defenderInHospital) {
            throw new BadRequestException('Target is not available for combat');
        }

        // Get equipped items for both players
        const attackerItems = await this.inventoryRepository.find({
            where: { userId: attackerId, equipped: true },
            relations: ['item'],
        });

        const defenderItems = await this.inventoryRepository.find({
            where: { userId: defenderId, equipped: true },
            relations: ['item'],
        });

        // Calculate total stats with equipment bonuses
        const attackerStrength = attacker.stats.strength + this.getStatBonus(attackerItems, 'strength');
        const attackerDefense = attacker.stats.defense + this.getStatBonus(attackerItems, 'defense');
        const attackerAgility = attacker.stats.agility + this.getStatBonus(attackerItems, 'agility');

        const defenderStrength = defender.stats.strength + this.getStatBonus(defenderItems, 'strength');
        const defenderDefense = defender.stats.defense + this.getStatBonus(defenderItems, 'defense');
        const defenderAgility = defender.stats.agility + this.getStatBonus(defenderItems, 'agility');

        // Combat simulation
        const attackerHitChance = Math.min(95, 50 + (attackerAgility - defenderAgility) * 0.5);
        const defenderHitChance = Math.min(95, 50 + (defenderAgility - attackerAgility) * 0.5);

        const attackerHits = Math.random() * 100 < attackerHitChance;
        const defenderHits = Math.random() * 100 < defenderHitChance;

        let attackerDamage = 0;
        let defenderDamage = 0;

        if (attackerHits) {
            attackerDamage = Math.max(1, attackerStrength - defenderDefense * 0.5);
        }

        if (defenderHits) {
            defenderDamage = Math.max(1, defenderStrength - attackerDefense * 0.5);
        }

        // Determine winner
        let result: CombatResult;
        let moneyStolen = 0;
        let xpGained = 0;

        if (attackerDamage > defenderDamage) {
            result = CombatResult.ATTACKER_WIN;
            // Attacker wins - steal money and gain XP
            const stealPercentage = 0.05 + Math.random() * 0.10; // 5-15%
            moneyStolen = Math.floor(Number(defender.moneyCash) * stealPercentage);
            xpGained = Math.floor(10 + defender.level * 5);

            attacker.moneyCash = Number(attacker.moneyCash) + moneyStolen;
            attacker.xp += xpGained;
            defender.moneyCash = Number(defender.moneyCash) - moneyStolen;

            // Send defender to hospital for 30-60 minutes
            const hospitalTime = 30 + Math.floor(Math.random() * 30);
            defender.hospitalReleaseTime = new Date(Date.now() + hospitalTime * 60 * 1000);
            defender.health = Math.max(10, defender.health - 30);

        } else if (defenderDamage > attackerDamage) {
            result = CombatResult.DEFENDER_WIN;
            // Defender wins - attacker goes to hospital
            const hospitalTime = 30 + Math.floor(Math.random() * 30);
            attacker.hospitalReleaseTime = new Date(Date.now() + hospitalTime * 60 * 1000);
            attacker.health = Math.max(10, attacker.health - 30);

        } else {
            result = CombatResult.DRAW;
            // Draw - both take minor damage
            attacker.health = Math.max(20, attacker.health - 10);
            defender.health = Math.max(20, defender.health - 10);
        }

        // Deduct nerve
        attacker.nerve -= nerveCost;

        // Check for level up
        const xpNeeded = attacker.level * 100;
        if (attacker.xp >= xpNeeded) {
            attacker.level += 1;
            attacker.xp -= xpNeeded;
        }

        // Save changes
        await this.userRepository.save(attacker);
        await this.userRepository.save(defender);

        // Log combat
        const combatLog = this.combatLogRepository.create({
            attackerId,
            defenderId,
            result,
            attackerDamageDealt: attackerDamage,
            defenderDamageDealt: defenderDamage,
            moneyStolen,
            xpGained,
        });

        await this.combatLogRepository.save(combatLog);

        // Send real-time notification to defender if online
        this.eventsGateway.sendNotificationToUser(defenderId, {
            type: 'combat_attack',
            message: 'Megtámadtak!',
            attacker: {
                id: attackerId,
                username: attacker.username,
                level: attacker.level,
            },
            result,
            damage: defenderDamage,
            moneyLost: result === CombatResult.ATTACKER_WIN ? moneyStolen : 0,
        });

        return {
            result,
            attackerDamage,
            defenderDamage,
            moneyStolen,
            xpGained,
            defenderName: defender.username,
        };
    }

    private getStatBonus(items: any[], stat: string): number {
        return items
            .filter(inv => inv.item.effectStat === stat)
            .reduce((sum, inv) => sum + inv.item.effectValue, 0);
    }

    async getCombatHistory(userId: string, limit: number = 20) {
        const logs = await this.combatLogRepository.find({
            where: [
                { attackerId: userId },
                { defenderId: userId },
            ],
            relations: ['attacker', 'defender'],
            order: { createdAt: 'DESC' },
            take: limit,
        });

        return logs;
    }

    async getOnlinePlayers(currentUserId: string) {
        // Get players who are not in prison/hospital and not the current user
        const players = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.id != :currentUserId', { currentUserId })
            .andWhere('(user.prisonReleaseTime IS NULL OR user.prisonReleaseTime < :now)', { now: new Date() })
            .andWhere('(user.hospitalReleaseTime IS NULL OR user.hospitalReleaseTime < :now)', { now: new Date() })
            .orderBy('user.level', 'DESC')
            .take(50)
            .getMany();

        return players;
    }
}
