import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173', // Vite default port
        credentials: true,
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(EventsGateway.name);
    private userSockets: Map<string, string> = new Map(); // userId -> socketId

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async handleConnection(client: Socket) {
        try {
            // Extract token from handshake auth or query
            const token = client.handshake.auth.token || client.handshake.query.token;

            if (!token) {
                this.logger.warn(`Client ${client.id} connection rejected: No token provided`);
                client.disconnect();
                return;
            }

            // Verify JWT token
            const payload = this.jwtService.verify(token as string);
            const userId = payload.sub;

            // Verify user exists
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                this.logger.warn(`Client ${client.id} connection rejected: User not found`);
                client.disconnect();
                return;
            }

            // Store user socket mapping
            this.userSockets.set(userId, client.id);
            client.data.userId = userId;

            this.logger.log(`User ${user.username} (${userId}) connected with socket ${client.id}`);
            this.logger.debug(`Total connected users: ${this.userSockets.size}`);

        } catch (error) {
            this.logger.error(`Client ${client.id} connection error:`, error.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (userId) {
            this.userSockets.delete(userId);
            this.logger.log(`User ${userId} disconnected from socket ${client.id}`);
            this.logger.debug(`Total connected users: ${this.userSockets.size}`);
        }
    }

    // Send notification to a specific user
    sendNotificationToUser(userId: string, notification: any) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.server.to(socketId).emit('notification', notification);
            this.logger.debug(`Notification sent to user ${userId}: ${JSON.stringify(notification)}`);
            return true;
        }
        this.logger.debug(`User ${userId} is not connected, notification not sent`);
        return false;
    }

    // Broadcast to all connected users
    broadcastNotification(notification: any) {
        this.server.emit('notification', notification);
        this.logger.debug(`Broadcast notification: ${JSON.stringify(notification)}`);
    }

    // Get online user count
    getOnlineUserCount(): number {
        return this.userSockets.size;
    }

    // Check if user is online
    isUserOnline(userId: string): boolean {
        return this.userSockets.has(userId);
    }

    @SubscribeMessage('ping')
    handlePing(client: Socket): string {
        return 'pong';
    }
}
