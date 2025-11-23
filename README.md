# Underworld Rise - Browser-Based Crime MMORPG

A complex, premium-quality browser-based MMORPG where players rise from a nobody criminal to become the city's Godfather.

## 🎮 Features

- **Crime System** - Commit crimes with stat-based success rates
- **PvP Combat** - Strategic turn-based combat system
- **Dynamic Economy** - Money laundering, stock market, black market drug trading
- **Gang System** - Create or join gangs, participate in gang wars
- **Training & Progression** - Level up and improve your stats
- **Real Estate** - Buy properties for passive bonuses
- **Casino Games** - Blackjack, Roulette, and more
- **Mission System** - Daily and story-based missions

## 🚀 Tech Stack

### Frontend
- **React** + **Vite** + **TypeScript**
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **Framer Motion** for animations
- **Socket.io Client** for real-time updates
- **Vanilla CSS** with custom design system

### Backend
- **NestJS** (Node.js + TypeScript)
- **PostgreSQL** for database
- **TypeORM** for ORM
- **Redis** for caching and sessions
- **Passport + JWT** for authentication
- **Socket.io** for WebSocket support

## 📦 Project Structure

```
GTA/
├── docs/                    # Project documentation
├── src/                     # Frontend source
│   ├── components/          # Reusable UI components
│   │   └── ui/             # Base UI components (Button, Card, etc.)
│   ├── pages/              # Page components
│   │   ├── auth/           # Login, Register
│   │   └── dashboard/      # Game pages
│   ├── styles/             # CSS files
│   │   ├── tokens.css      # Design tokens
│   │   ├── global.css      # Global styles
│   │   └── components.css  # Component styles
│   ├── store/              # Zustand stores
│   ├── api/                # API client
│   └── hooks/              # Custom React hooks
├── server/                 # Backend source
│   └── src/
│       ├── auth/           # Authentication module
│       ├── game/           # Game mechanics modules
│       ├── database/       # Database migrations & entities
│       └── cron/           # Background jobs
└── docker-compose.yml      # Development environment
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for database)

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# For development, the defaults should work fine
```

### 3. Start Database

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d

# Access PgAdmin at http://localhost:5050
# Email: admin@underworld.local
# Password: admin
```

### 4. Run Development Servers

```bash
# Terminal 1: Start frontend (http://localhost:3000)
npm run dev

# Terminal 2: Start backend (http://localhost:5000)
cd server
npm run start:dev
```

## 🎨 Design System

The game features a **premium dark noir aesthetic** with:

- **Dark Background** - Deep blacks (#0a0a0f) with subtle gradients
- **Glassmorphism** - Frosted glass panels with backdrop blur
- **Neon Accents** - Red (#ff3366), Cyan (#00d9ff), Gold (#ffd700)
- **Custom Typography** - Orbitron for headings, Inter for body
- **Smooth Animations** - Micro-interactions, hover effects, transitions
- **Responsive Design** - Mobile and desktop optimized

### Color Palette
- **Primary Accent**: Neon Red (#ff3366) - Danger, Crime
- **Secondary Accent**: Neon Cyan (#00d9ff) - Info, Actions
- **Success**: Neon Green (#00ff88)
- **Warning**: Orange (#ffaa00)
- **Gold**: (#ffd700) - Premium currency

## 📊 Database Schema

Key tables:
- `users` - Player accounts and resources
- `user_stats` - Strength, Defense, Agility, Intelligence
- `crimes` - Crime definitions
- `items` - Weapons, armor, vehicles
- `inventory` - Player items
- `gangs` - Gang information
- `properties` - Real estate
- `market_listings` - Player marketplace
- `combat_logs` - PvP history

## 🎯 Game Mechanics

### Energy System
- Energy regenerates every 5 minutes
- Used for committing crimes
- Nerve for PvP attacks
- Willpower for training

### Crime Success Formula
```
Success % = (User Intelligence × 1.5 / Crime Difficulty) × 100
Max 95% success rate
```

### Combat System
```
Hit Chance = Attacker Agility / (Attacker Agility + Defender Agility) × 100
Damage = Weapon Damage + (Attacker Strength × 0.5) - (Defender Defense × 0.3)
Critical Hit (>90% hit chance) = 2× damage
```

### Money Laundering
- Dirty Cash (raidable) → Clean Bank Money
- Fee: 20-40% (decreases with Intelligence)
- Bank money earns 0.5% daily interest

## 🔒 Security Features

- JWT authentication with secure httpOnly cookies
- Password hashing with bcrypt
- Input validation with class-validator
- Rate limiting on API endpoints
- CSRF protection
- SQL injection prevention via TypeORM
- Anti-cheat detection for impossible actions

## 📝 Development Roadmap

- [x] Project setup and infrastructure
- [x] Premium design system
- [x] Authentication pages
- [x] Dashboard layout
- [ ] Crime system implementation
- [ ] Combat system
- [ ] Economy features (Bank, Market)
- [ ] Gang system
- [ ] Advanced features (Casino, Stocks, Properties)
- [ ] Real-time chat
- [ ] Admin panel
- [ ] Testing and optimization
- [ ] Deployment

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

All rights reserved.

---

**Built with ❤️ for the criminal underworld**
