import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { User } from '../../entities/user.entity';
import { CombatLog } from '../../entities/combat-log.entity';
import { Inventory } from '../../entities/inventory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, CombatLog, Inventory])],
    controllers: [CombatController],
    providers: [CombatService],
    exports: [CombatService],
})
export class CombatModule { }
