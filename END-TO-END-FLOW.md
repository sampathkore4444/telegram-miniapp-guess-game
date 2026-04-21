# BIG/SMALL Dice Game - Complete End-to-End Platform Documentation

---

## 📋 Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Schema](#5-database-schema)
6. [Redis Data Storage](#6-redis-data-storage)
7. [API Endpoints](#7-api-endpoints)
8. [WebSocket Events](#8-websocket-events)
9. [Game Flow - Step by Step](#9-game-flow---step-by-step)
10. [Frontend-Backend Communication](#10-frontend-backend-communication)
11. [Deployment - Docker](#11-deployment---docker)
12. [Deployment - Without Docker](#12-deployment---without-docker)
13. [Environment Variables](#13-environment-variables)
14. [Feature Explanations](#14-feature-explanations)
15. [Telegram Bot Setup](#15-telegram-bot-setup)
16. [System Design & Data Structures & Algorithms](#16-system-design--data-structures--algorithms)

---

## 1. Platform Overview

### 🎮 What is this Platform?

A real-time Telegram Mini App dice prediction game where players bet on whether the dice roll will be BIG (4-6) or SMALL (1-3).

### 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State Management | Zustand |
| Real-time | Socket.io |
| Backend | Node.js + Express |
| Database | PostgreSQL (Prisma ORM) |
| Cache | Redis |
| Container | Docker |

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TELEGRAM APP                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Telegram WebView                         │    │
│  │                    (Mini App)                               │    │
│  └─────────────────────────┬───────────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                     HTTPS / WebSocket
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                         FRONTEND (Port 80)                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  React App (Nginx)                                          │    │
│  │  - Components (UI, Game)                                    │    │
│  │  - Context (Auth, Game)                                     │    │
│  │  - Services (API, Socket)                                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
      HTTPS            WebSocket          HTTPS
         │                  │                  │
         │                  │                  │
┌────────▼────────┐  ┌────▼────────┐  ┌──────▼──────┐
│  REST API       │  │  Socket.IO  │  │   Health    │
│  (Auth, Game)   │  │  (Real-time)│  │   Check     │
└───────┬──────── ┘  └──────┬──────┘  └─────────────┘
        │                  │
        │                  │
┌───────▼─────────────────▼──────────────────────────────────────────┐
│                      BACKEND (Port 3000)                           │
│                                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐      │
│  │ Auth Routes │  │ Game Routes │  │ Player Routes          │      │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬────────────┘      │
│         │                 │                      │                 │
│  ┌──────▼────────────────▼──────────────────────▼──────────────┐   │
│  │                    SERVICES LAYER                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐    │   │
│  │  │  Game    │  │  Wallet  │  │ Leaderboard│  │  Bonus  │    │   │
│  │  │ Service  │  │ Service  │  │  Service   │  │ Service │    │   │
│  │  └────┬─────┘  └────┬─────┘  └─────┬──────┘  └────┬────┘    │   │
│  └───────┼─────────────┼───────────────┼───────────────┼───────┘   │
│          │             │               │               │           │
└──────────┼─────────────┼───────────────┼───────────────┼───────────┘
           │             │               │               │
    ┌──────▼─────┐ ┌─────▼─────┐ ┌─────▼──────┐ ┌─────▼─────┐
    │   Redis    │ │ PostgreSQL│ │  Database  │ │   Kafka   │
    │  (Cache)   │ │ (Prisma)  │ │  (Prisma)  │ │(Optional) │
    └────────────┘ └───────────┘ └────────────┘ └───────────┘
```

---

## 3. Frontend Architecture

### 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Loader.jsx
│   │   ├── game/         # Game-specific components
│   │   │   ├── DiceArea.jsx
│   │   │   ├── ChoiceButtons.jsx
│   │   │   └── BetSelector.jsx
│   │   └── layout/       # Layout components
│   ├── context/          # React Context
│   │   ├── AuthContext.jsx    # User authentication
│   │   └── GameContext.jsx    # Game state
│   ├── hooks/           # Custom hooks
│   ├── services/        # API & Socket services
│   │   ├── api.service.js      # REST API calls
│   │   └── socket.service.js    # WebSocket handling
│   ├── utils/          # Utility functions
│   │   ├── sound.js     # Audio effects
│   │   ├── haptic.js    # Vibration feedback
│   │   └── analytics.js # Event tracking
│   ├── pages/          # Page components
│   │   ├── GamePage.jsx
│   │   └── LoadingPage.jsx
│   └── styles/         # Global styles
├── public/
│   ├── sw.js          # Service Worker
│   └── index.html
└── package.json
```

### 🔑 Key Components

#### 3.1 AuthContext.jsx

Manages user authentication state:
- Telegram login
- Token storage
- User profile

```javascript
// Usage
const { user, token, balance } = useAuth();
```

#### 3.2 GameContext.jsx

Manages game state:
- Current round
- Bet placement
- Dice rolling
- Results

```javascript
// Usage
const { placeBet, gameState, isConnected } = useGame();
```

#### 3.3 SocketService.js

Handles WebSocket communication:
- Connects to backend
- Emits events (place bet, join game)
- Listens for events (game state, results)

---

## 4. Backend Architecture

### 📁 Folder Structure

```
backend/
├── src/
│   ├── core/
│   │   ├── config/       # Configuration (environment variables)
│   │   ├── constants/    # Game constants
│   │   └── utils/       # Utilities (logger)
│   ├── common/
│   │   ├── interfaces/   # TypeScript interfaces
│   │   └── events/      # WebSocket event types
│   ├── database/
│   │   ├── prisma/      # PostgreSQL client
│   │   └── redis/       # Redis client
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── game.routes.js
│   │   ├── player.routes.js
│   │   └── leaderboard.routes.js
│   ├── schemas/        # Request/Response validation (Zod)
│   │   ├── auth.schema.js
│   │   ├── game.schema.js
│   │   ├── player.schema.js
│   │   └── leaderboard.schema.js
│   ├── models/         # Database models
│   │   ├── User.js
│   │   ├── GameRound.js
│   │   ├── Bet.js
│   │   └── Transaction.js
│   ├── services/       # Business logic (MODULAR)
│   │   ├── game/game.service.js      # Dice rolling, betting
│   │   ├── wallet/wallet.service.js  # Balance management
│   │   ├── leaderboard/leaderboard.service.js
│   │   └── bonus/bonus.service.js
│   ├── websocket/      # WebSocket handlers
│   │   └── index.js
│   └── index.js        # Entry point
├── prisma/
│   └── schema.prisma  # Database schema
├── tests/             # Unit tests
├── Dockerfile
└── package.json
```

### 🔑 Key Services

#### 4.1 GameService

Core game logic:
- Round management (create, start, end)
- Betting validation
- Dice rolling (RNG)
- Settlement calculation
- Win/Loss determination

#### 4.2 WalletService

Player balance management:
- Get/Set balance
- Add/Deduct coins
- Transaction history
- Daily loss limits

#### 4.3 LeaderboardService

Rankings:
- Update scores
- Get top players
- Get player rank
- Daily snapshots

---

## 5. Database Schema

### PostgreSQL Tables (via Prisma)

#### User Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique user ID |
| telegramId | BigInt | Telegram user ID |
| username | String | Display name |
| totalCoins | Integer | Total coins |
| level | Integer | Player level |
| createdAt | DateTime | Account creation |
| updatedAt | DateTime | Last update |

#### GameRound Table

| Column | Type | Description |
|--------|------|-------------|
| id | String | Round ID |
| phase | String | Current phase |
| diceResult | Integer | Dice value (1-6) |
| totalPool | Integer | Total bet pool |
| bigBets | Integer | Total BIG bets |
| smallBets | Integer | Total SMALL bets |
| playerCount | Integer | Number of players |
| createdAt | DateTime | Round start |
| closedAt | DateTime | Round end |

#### Bet Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Bet ID |
| roundId | String | Round ID |
| userId | String | User ID |
| amount | Integer | Bet amount |
| choice | String | BIG or SMALL |
| payout | Integer | Payout amount |
| result | String | WIN or LOSE |
| timestamp | DateTime | Bet time |

#### Transaction Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Transaction ID |
| userId | String | User ID |
| roundId | String | Round ID (optional) |
| amount | Integer | Amount |
| type | String | BET, WIN, LOSE, BONUS |
| balanceAfter | Integer | Balance after transaction |
| timestamp | DateTime | Transaction time |

---

## 6. Redis Data Storage

### Key-Value Pairs

| Key Pattern | Data Type | Description |
|-------------|-----------|-------------|
| `player:{id}:balance` | String | Player balance |
| `player:{id}:session` | Hash | Player session |
| `player:{id}:dailyLoss` | String | Today's loss |
| `round:{id}` | Hash | Round state |
| `round:active` | String | Current round ID |
| `round:{id}:bets` | Hash | Round bets |
| `leaderboard:global` | Sorted Set | Player rankings |
| `leaderboard:usernames` | Hash | Username mappings |

---

## 7. API Endpoints

### 7.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/telegram-login | Login with Telegram |
| POST | /api/auth/refresh-token | Refresh JWT token |
| GET | /api/auth/verify | Verify token |

### 7.2 Game

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/game/state | Get current game state |
| GET | /api/game/history | Get player's game history |
| POST | /api/game/place-bet | Place a bet |

### 7.3 Player

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/player/profile | Get player profile |
| GET | /api/player/wallet | Get wallet info |
| POST | /api/player/claim-daily-bonus | Claim daily bonus |

### 7.4 Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leaderboard/global | Get global leaderboard |
| GET | /api/leaderboard/daily | Get daily leaderboard |
| GET | /api/leaderboard/me | Get my rank |

---

## 8. WebSocket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| PLACE_BET | `{roundId, choice, amount}` | Place a bet |
| JOIN_GAME | - | Join current game |
| CLAIM_REWARD | - | Claim bonus |
| LEAVE_GAME | - | Leave game |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| GAME_STATE | `{roundId, phase, timeLeft}` | Game state update |
| BET_ACCEPTED | `{status}` | Bet placed successfully |
| BET_REJECTED | `{reason}` | Bet rejected |
| DICE_RESULT | `{dice, winner}` | Dice rolled |
| BET_SETTLEMENT | `{amount, reward, result}` | Bet result |
| WALLET_UPDATE | `{balance, change}` | Balance changed |
| NEW_ROUND_STARTED | `{roundId, timeLeft}` | New round |

---

## 9. Game Flow - Step by Step

### Phase 1: User Opens Telegram Mini App

```
1. User clicks "Play Game" in Telegram bot
2. Telegram opens WebView with Mini App URL
3. Frontend loads React app
4. Frontend sends initData to backend
5. Backend verifies Telegram auth
6. Backend returns JWT token + initial balance
```

### Phase 2: Authentication

```
1. Frontend calls POST /api/auth/telegram-login
2. Backend parses initData from Telegram
3. Backend extracts user_id and user info
4. Backend creates/updates user in PostgreSQL
5. Backend generates JWT token
6. Frontend stores token in localStorage
7. WebSocket connects with token
```

### Phase 3: Game Initialization

```
1. WebSocket connects
2. Backend sends GAME_STATE with current round
3. Frontend displays:
   - Dice area (waiting state)
   - BIG/SMALL buttons
   - Bet amount selector
   - Current balance
```

### Phase 4: Placing a Bet

```
1. Player selects bet amount (50/100/200/500)
2. Player selects BIG or SMALL
3. Player clicks ROLL
4. Frontend sends PLACE_BET via WebSocket
5. Backend validates:
   - Balance check
   - Round is open
   - Bet amount valid
6. Backend deducts bet from Redis balance
7. Backend stores bet in round data
8. Backend sends BET_ACCEPTED
9. Frontend shows "Bet Placed!"
```

### Phase 5: Dice Rolling

```
1. Betting timer ends (8 seconds)
2. Backend locks round (no more bets)
3. Backend generates random dice (1-6)
4. Backend determines winner (BIG if 4-6, SMALL if 1-3)
5. Backend sends DICE_RESULT to all players
6. Frontend:
   - Plays dice animation (2-3 sec)
   - Shows rolling effect
   - Reveals result
```

### Phase 6: Settlement

```
1. Backend calculates payouts:
   - WIN: bet × 2 (e.g., 100 → 200)
   - LOSE: bet × 0 (e.g., 100 → 0)
2. Backend updates Redis balance
3. Backend sends BET_SETTLEMENT to each player
4. Frontend shows:
   - WIN: "+200 coins!" (green)
   - LOSE: "-100 coins" (red)
```

### Phase 7: New Round

```
1. Backend starts new round
2. Backend sends NEW_ROUND_STARTED
3. Frontend resets:
   - Dice back to "?"
   - Buttons active
   - Timer resets
4. Repeat from Phase 4
```

---

## 10. Frontend-Backend Communication

### 10.1 HTTP Communication (REST API)

```
Frontend                          Backend
   │                                 │
   │──── POST /api/auth/login ──────►│
   │◄─── JWT Token + User Data ─────│
   │                                 │
   │──── GET /api/player/profile ───►│
   │◄─── Profile + Balance ───────────│
   │                                 │
```

### 10.2 WebSocket Communication (Real-time)

```
Frontend                          Backend
   │                                 │
   │──── WebSocket Connect ─────────►│
   │◄─── GAME_STATE ────────────────│
   │                                 │
   │──── PLACE_BET ─────────────────►│
   │◄─── BET_ACCEPTED ──────────────│
   │                                 │
   │◄─── DICE_RESULT ───────────────│
   │◄─── BET_SETTLEMENT ────────────│
   │◄─── WALLET_UPDATE ─────────────│
   │                                 │
```

### 10.3 Request Flow Diagram

```
┌──────────────┐      HTTP       ┌──────────────┐
│              │  ─────────────► │              │
│   Frontend   │                │    Backend   │
│              │ ◄───────────── │              │
└──────────────┘   Response      └──────────────┘

         WebSocket (Bidirectional)
┌──────────────┐                ┌──────────────┐
│              │◄───────────────►│              │
│   Frontend   │   Real-time    │    Backend   │
│              │    Events      │              │
└──────────────┘                └──────────────┘
```

---

## 11. Deployment - Docker

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Step 1: Clone & Configure

```bash
# Clone repository
git clone <repo-url>
cd telegramminiapp-guess-game

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 2: Configure Environment Variables

Edit `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://dicegame:dicegame123@postgres:5432/dicegame
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-secret-key
TELEGRAM_BOT_TOKEN=your-bot-token
```

### Step 3: Start All Services

```bash
# Start all containers (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d
```

### Step 4: Verify Services

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Check health
curl http://localhost:3000/health
curl http://localhost/health
```

### Step 5: Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### Docker Services Overview

| Service | Port | Description |
|---------|------|-------------|
| frontend | 80 | Nginx serving React app |
| backend | 3000 | Node.js API server |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache |

---

## 12. Deployment - Without Docker

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Step 1: Install PostgreSQL

```bash
# Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE dicegame;
CREATE USER dicegame WITH PASSWORD 'dicegame123';
GRANT ALL PRIVILEGES ON DATABASE dicegame TO dicegame;
```

### Step 2: Install Redis

```bash
# Ubuntu
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
nano .env

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start backend
npm run dev
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
nano .env

# Start development server
npm run dev
```

### Step 5: Access the App

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health Check | http://localhost:3000/health |

### Stopping Services

```bash
# Stop backend
# Press Ctrl+C in terminal

# Stop frontend
# Press Ctrl+C in terminal

# Stop PostgreSQL (optional)
sudo systemctl stop postgresql

# Stop Redis (optional)
sudo systemctl stop redis-server
```

---

## 13. Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | - |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| JWT_SECRET | JWT signing secret | - |
| TELEGRAM_BOT_TOKEN | Telegram bot token | - |
| BETTING_DURATION | Seconds for betting | 8 |
| ROLLING_DURATION | Seconds for rolling | 3 |
| INITIAL_BET | Starting coins | 1000 |
| MIN_BET | Minimum bet | 50 |
| MAX_BET | Maximum bet | 1000 |
| PAYOUT_MULTIPLIER | Win multiplier | 2 |
| LOG_LEVEL | Logging level | info |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000 |
| VITE_WS_URL | WebSocket URL | ws://localhost:3000 |
| VITE_ENABLE_SOUND | Enable sound effects | true |
| VITE_ENABLE_HAPTIC | Enable haptic feedback | true |

---

## 14. Feature Explanations

### 14.1 Sound Effects

Uses Web Audio API for generating sounds:

- Dice roll: Short beeps during rolling
- Win: Ascending musical notes
- Lose: Descending notes
- Bet placed: Quick confirmation beep

### 14.2 Haptic Feedback

Uses Navigator.vibrate API:

- Light: 10ms - Button taps
- Medium: 20ms - Selection
- Heavy: 30ms - Important actions
- Success: 50ms pause 50ms - Win confirmation
- Error: 100ms pause 100ms - Loss

### 14.3 Toast Notifications

React Context-based notification system:

- Success (green) - Wins, confirmations
- Error (red) - Bet rejected, errors
- Warning (yellow) - Limits reached
- Info (blue) - General info

### 14.4 PWA / Service Worker

Features:

- Offline caching of static assets
- Push notification support
- Background sync for offline actions
- Installable on mobile home screen

### 14.5 Analytics Tracking

Tracks:

- Page views
- Button clicks
- Bet placement
- Game results
- Errors
- Session duration

### 14.6 Authentication Flow

```
Telegram User → WebView → Frontend → Backend
                                    ↓
                              Verify initData
                                    ↓
                              Generate JWT
                                    ↓
                              Return + Balance
```

### 14.8 Real-time Updates

How WebSocket maintains connection:

1. Client connects with JWT token
2. Server authenticates token
3. Server attaches user to game room
4. Server broadcasts game events to all connected clients
5. Client updates UI in real-time

---

## 📞 Support

---

## 15. Telegram Bot Setup

### Creating a Telegram Bot

1. **Open Telegram** and search for **@BotFather**
2. **Send command**: `/newbot`
3. **Enter bot name**: `BIG SMALL Dice Game`
4. **Enter username**: Must end with `bot` (e.g., `bigsmall_dice_bot`)
5. **Copy the Bot Token** shown (e.g., `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Configuring the Bot

1. **Set Bot Profile Picture**
   - Send `/setbotpic` to @BotFather
   - Upload an image

2. **Set Description**
   - Send `/setdescription` to @BotFather
   - Enter: "🎲 Play BIG/SMALL dice game and win coins!"

3. **Set About**
   - Send `/setabouttext` to @BotFather
   - Enter: "A fun dice prediction game"

4. **Enable Menu Button**
   - Send `/setmenubutton` to @BotFather
   - Enter button text: "🎮 Play Game"
   - Enter URL: `https://your-domain.com` (or localhost for testing)

### Setting Up Commands

Send these commands to @BotFather:

```
/setcommands

play - Start playing the game
balance - Check your coin balance
help - Get help information
leaderboard - View top players
```

### Configuring Mini App URL

1. **Deploy your frontend** (see Deployment sections)
2. **Get your HTTPS URL** (required by Telegram)
   - For testing: Use ngrok or similar
   - For production: Use your domain
3. **Set the menu button URL**:
   - Send `/setmenubutton` to @BotFather
   - Enter button text: "🎮 Play Game"
   - Enter your HTTPS URL

### Getting the Bot Token

1. Open @BotFather in Telegram
2. Click on your bot
3. Click "API Token"
4. Copy the token
5. Add to your `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### Testing the Bot

1. **Start a chat** with your bot
2. **Click "Start"** or send `/start`
3. **Click the menu button** to open Mini App
4. **Play the game!**

### Bot Webhook Setup (Optional)

For production, set webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/api/telegram/webhook"
```

---

---

## 16. System Design & Data Structures & Algorithms

### 16.1 System Design Principles

#### Scalability Architecture

```
                        ┌─────────────────────────────────────────┐
                        │            LOAD BALANCER                │
                        │         (Nginx/Traefik)                │
                        └──────────────┬──────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   Backend #1    │    │   Backend #2    │    │   Backend #3    │
    │   (Node.js)    │    │   (Node.js)    │    │   (Node.js)    │
    └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
           ┌───────────────┐               ┌───────────────┐
           │   PostgreSQL  │               │     Redis     │
           │  (Primary DB) │               │    (Cache)   │
           └───────────────┘               └───────────────┘
```

#### Horizontal Scaling Strategy

| Component | Strategy | Implementation
|-----------|----------|----------------
| Backend | Stateless | JWT auth, Redis session
| Database | Read Replicas | PostgreSQL replication
| Cache | Distributed | Redis Cluster
| WebSocket | Sticky Sessions | Redis Pub/Sub for broadcast

### 16.2 Data Structures

#### Game State Machine

```
┌─────────┐    betting    ┌─────────┐    lock    ┌─────────┐    rolling    ┌──────────────┐
│  INIT   │ ────────────► │  OPEN   │ ─────────► │ LOCKED  │ ────────────► │   ROLLING    │
└─────────┘               └─────────┘            └─────────┘                └──────┬───────┘
                                                                                      │
                                              ┌─────────┐    settle    ┌──────────────┴───────┐
                                              │ RESULT  │ ◄─────────── │                      │
                                              │ CALC    │             │                      ▼
                                              └─────────┘             ┌─────────┐
                                                                           │ close   ┌─────────┐
                                                                           └────────►│ CLOSED  │
                                                                                    └─────────┘
```

#### Redis Data Structures

| Key | Type | Example | Purpose |
|-----|------|---------|---------|
| `player:{id}:balance` | String | "1000" | Quick balance access |
| `round:{id}` | Hash | {phase, pool, bets} | Round state |
| `leaderboard:global` | Sorted Set | {user1: 5000, user2: 3000} | Rankings |
| `round:active` | String | "round_123" | Current round |
| `game:bets:{round}` | Set | [bet1, bet2, bet3] | Round bets |

#### PostgreSQL Data Models

```
User ──────► Bet ──────► GameRound
  │                   ▲
  │                   │
  └─────► Transaction │
```

- **User**: Player account (one-to-many with Bet, Transaction)
- **GameRound**: Each game round (one-to-many with Bet)
- **Bet**: Individual bet placed by user (many-to-one with User, GameRound)
- **Transaction**: Ledger of all balance changes (many-to-one with User)

### 16.3 Algorithms

#### 16.3.1 Dice Rolling Algorithm

```javascript
// Crypto-secure random number generation
function rollDice() {
  // Use crypto.getRandomValues() for true randomness
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  
  // Map to 1-6 range
  const dice = (array[0] % 6) + 1;
  return dice;
}
```

**Complexity**: O(1)

**Fairness**: Uses `crypto.getRandomValues()` for cryptographically secure randomness, ensuring unbiased results.

#### 16.3.2 Winner Determination

```javascript
// BIG = 4, 5, 6 (three faces)
// SMALL = 1, 2, 3 (three faces)
const BIG_RANGE = [4, 5, 6];
const SMALL_RANGE = [1, 2, 3];

function determineWinner(dice) {
  return BIG_RANGE.includes(dice) ? 'BIG' : 'SMALL';
}
```

**Complexity**: O(1)

#### 16.3.3 Payout Calculation

```javascript
function calculatePayout(betAmount, betChoice, winner) {
  if (betChoice === winner) {
    return {
      win: true,
      reward: betAmount * PAYOUT_MULTIPLIER, // 2x
      netProfit: betAmount * (PAYOUT_MULTIPLIER - 1) // 1x
    };
  }
  return {
    win: false,
    reward: 0,
    netProfit: -betAmount
  };
}
```

**Complexity**: O(1)

#### 16.3.4 Leaderboard Ranking (ZSET Operations)

```javascript
// Redis Sorted Set operations
await redis.zadd('leaderboard:global', score, userId);
await redis.zrevrange('leaderboard:global', 0, 9, 'WITHSCORES');
await redis.zrevrank('leaderboard:global', userId);
```

**Time Complexity**:
- Add score: O(log N)
- Get top N: O(log N + M)
- Get rank: O(log N)

#### 16.3.5 Rate Limiting (Token Bucket)

```javascript
// Token bucket algorithm for rate limiting
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;      // Max tokens
    this.tokens = capacity;        // Current tokens
    this.refillRate = refillRate;  // Tokens per second
    this.lastRefill = Date.now();
  }

  consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true; // Allowed
    }
    return false; // Rate limited
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
}
```

### 16.4 Caching Strategy

#### Cache-Aside Pattern

```
┌─────────┐    request    ┌─────────┐    miss    ┌────────────┐
│ Client  │ ────────────► │  Cache  │ ──────────► │  Database  │
└─────────┘               └────┬────┘             └────────────┘
                                │
                      ┌─────────┴─────────┐
                      │ cache hit         │
                      ▼                   ▼
                 Return data        Store & return
```

#### Cache Invalidation

| Data Type | TTL | Invalidation |
|-----------|-----|--------------|
| User balance | 0 (no cache) | Real-time |
| Game state | 1 second | On phase change |
| Leaderboard | 30 seconds | On bet settlement |
| User profile | 5 minutes | On update |

### 16.5 Concurrency Control

#### Optimistic Locking for Bets

```javascript
async function placeBet(userId, roundId, amount, choice) {
  // Start transaction
  return await prisma.$transaction(async (tx) => {
    // Get current balance with lock
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (user.totalCoins < amount) {
      throw new Error('Insufficient balance');
    }

    // Atomic update
    await tx.user.update({
      where: { id: userId },
      data: { totalCoins: { decrement: amount } },
    });

    // Create bet
    return await tx.bet.create({
      data: { userId, roundId, amount, choice },
    });
  });
}
```

### 16.6 Security Measures

#### Authentication Flow

```
┌─────────┐    initData    ┌─────────┐    verify    ┌─────────────┐
│ Telegram│ ──────────────►│ Backend │ ────────────►│ Telegram API│
│  Mini   │                │         │               │   (Verify)  │
│  App    │◄───────────────│         │◄──────────────│             │
└─────────┘    JWT Token   └─────────┘   Success    └─────────────┘
```

#### Security Checklist

| Measure          | Implementation                     |
|------------------|------------------------------------|
| XSS Protection   | Input sanitization, CSP headers    |
| CSRF             | Same-origin, JWT in headers        |
| Rate Limiting    | Token bucket per user              |
| SQL Injection    | Prisma ORM (parameterized queries) |
| Input Validation | Zod schemas                        |
| Bot Protection   | Telegram CAPTCHA integration       |

### 16.7 Performance Optimizations

#### Database Indexing

```prisma
model User {
  id          String  @id @default(uuid())
  telegramId  BigInt  @unique  // Index for fast lookup
  totalCoins  Int
  // ...
}

model Bet {
  id        String  @id @default(uuid())
  userId    String  // Index
  roundId   String  // Index
  amount    Int
  // ...

  @@index([userId, roundId])
}

model GameRound {
  id        String  @id
  phase     String  // Index
  createdAt DateTime @default(now())
  // ...

  @@index([phase, createdAt])
}
```

#### Connection Pooling

```javascript
// Prisma connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});
```

---

For issues or questions, please refer to the GitHub repository.

---

*Last Updated: 2026-04-21*
