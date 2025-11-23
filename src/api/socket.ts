import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketClient {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) {
            console.log('Socket already connected');
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            auth: {
                token,
            },
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('Socket disconnected manually');
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Helper method to listen for notifications
    onNotification(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    // Helper method to remove notification listener
    offNotification(callback: (data: any) => void) {
        if (this.socket) {
            this.socket.off('notification', callback);
        }
    }

    // Send ping to test connection
    ping() {
        if (this.socket) {
            this.socket.emit('ping');
        }
    }
}

// Export singleton instance
export const socketClient = new SocketClient();
export default socketClient;
