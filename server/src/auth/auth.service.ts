import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserStats } from '../entities/user-stats.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserStats)
        private userStatsRepository: Repository<UserStats>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { username, email, password } = registerDto;

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });

        if (existingUser) {
            throw new ConflictException('Username or email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = this.userRepository.create({
            username,
            email,
            passwordHash,
        });

        const savedUser = await this.userRepository.save(user);

        // Create user stats
        const stats = this.userStatsRepository.create({
            userId: savedUser.id,
        });

        await this.userStatsRepository.save(stats);

        // Generate JWT token
        const token = this.generateToken(savedUser);

        return {
            user: this.sanitizeUser(savedUser),
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user with stats
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['stats'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    async validateUser(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['stats', 'gang'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.sanitizeUser(user);
    }

    private generateToken(user: User): string {
        const payload = { sub: user.id, email: user.email, username: user.username };
        return this.jwtService.sign(payload);
    }

    private sanitizeUser(user: User) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
}
