# 🎮 SPEC.md - BIG/SMALL Dice Game Telegram Mini App

## 📋 Table of Contents

1. [Overview](#1-overview)
2. [Game Rules](#2-game-rules)
3. [UI/UX Design](#3-uiux-design)
4. [Game Flow](#4-game-flow)
5. [Technical Architecture](#5-technical-architecture)
6. [WebSocket Events](#6-websocket-events)
7. [State Management](#7-state-management)
8. [API Specifications](#8-api-specifications)
9. [Security](#9-security)
10. [Economy Model](#10-economy-model)

---

## 1. Overview

### 📝 Project Description

| Field | Value |
|-------|-------|
| **Project Name** | BIG/SMALL Dice Game |
| **Platform** | Telegram Mini App |
| **Type** | Real-time prediction game |
| **Core Gameplay** | Players predict whether the dice roll will be BIG (4-6) or SMALL (1-3) |
| **Technology** | React + WebSocket + Node.js backend |
| **Target Users** | Telegram users seeking casual gaming entertainment |

### 🎯 Game Objective

- Players place bets choosing between **BIG** (4-6) or **SMALL** (1-3)
- Correct prediction = win coins (2x multiplier)
- Incorrect prediction = lose bet amount
- Game rounds are continuous (~3-5 seconds per round)

---

## 2. Game Rules

### 🎲 Core Mechanics

| Rule | Description |
|------|-------------|
| **Dice** | Single die, values 1-6 |
| **BIG Range** | 4, 5, 6 |
| **SMALL Range** | 1, 2, 3 |
| **Payout** | 2x bet amount (win) |
| **Loss** | Bet amount deducted (lose) |

### 🪙 Betting Options

| Amount | Description |
|--------|-------------|
| 50 | Minimum bet |
| 100 | Standard bet |
| 200 | Medium bet |
| 500 | High bet |

### 🏆 Progression

| Level | Requirement |
|-------|-------------|
| Level 1 | 0+ coins |
| Level 2 | 1000+ coins |
| Level 3 | 5000+ coins |
| Level 4 | 20000+ coins |
| Level 5 | 100000+ coins |

### 🎁 Bonus System

| Trigger | Reward | Rarity |
|---------|--------|--------|
| 3 wins in a row | Lucky Red Packet | Common |
| Daily login | Daily Bonus | Common |
| Random drop | Mystery Reward | Rare |

### 🧧 Red Packet Rewards

| Type | Range |
|------|-------|
| Coins | 10-100 |
| Boost | 2x multiplier |
| Bonus | Special event |

---

## 3. UI/UX Design

### 📱 Entry Screen Layout

```
┌─────────────────────────────┐
│  🎯 Coins: 23,580      🏆 │
│  Level: 3                 │
├─────────────────────────────┤
│                             │
│         🎲 DICE AREA        │
│      (animated dice)        │
│                             │
├─────────────────────────────┤
│                             │
│   ┌─────┐   ┌─────┐        │
│   │ BIG │   │SMALL│        │
│   │4-6  │   │1-3  │        │
│   └─────┘   └─────┘        │
│                             │
├─────────────────────────────┤
│  Bet: [50] [100] [200] [500]│
├─────────────────────────────┤
│         ▶ ROLL ◀           │
└─────────────────────────────┘
```

### 🎨 Visual Design

#### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Gold | #FFD700 | Coins, highlights |
| Background Dark | #1A1A2E | Main background |
| Card Background | #16213E | Component background |
| BIG Button | #E94560 | BIG button |
| SMALL Button | #0F3460 | SMALL button |
| Win Green | #00D26A | Win indicators |
| Lose Red | #FF4757 | Lose indicators |
| Text Primary | #FFFFFF | Main text |
| Text Secondary | #A0A0A0 | Secondary text |

#### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Coins Display | Bold | 24px | 700 |
| Level Display | Medium | 16px | 500 |
| Button Text | Bold | 18px | 700 |
| Bet Amount | Medium | 14px | 500 |
| Timer | Bold | 32px | 700 |

### 🖥️ Screen States

#### 1. Waiting State
- Dice shows idle animation
- Timer counting down
- Buttons disabled

#### 2. Betting State
- BIG/SMALL buttons active
- Bet amount selector active
- ROLL button active
- Timer visible

#### 3. Rolling State
- Dice animation playing
- Suspense moment (2-3 seconds)
- All buttons disabled

#### 4. Result State - WIN
- "🎉 BIG WIN!" or "🎉 SMALL WIN!" displayed
- +X coins animation
- Green glow effect

#### 5. Result State - LOSE
- "❌ You Lost" displayed
- -X coins animation
- Red flash effect

---

## 4. Game Flow

### 🔄 Complete Event Flow

```plaintext
Telegram Open
      ↓
Mini App Loads
      ↓
Auth via initData
      ↓
WebSocket Connect
      ↓
Receive Game State
      ↓
BETTING_OPEN
      ↓
User Places Bet
      ↓
Redis Lock Bet + Store
      ↓
BETTING_CLOSED
      ↓
RNG Roll (1-6)
      ↓
Result Broadcast
      ↓
Wallet Settlement
      ↓
Bonus Check
      ↓
New Round Starts
```

### ⏱️ Round Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| BETTING_OPEN | 8 seconds | Players can place bets |
| ROLLING | 2-3 seconds | Dice animation |
| SETTLEMENT | 1 second | Process results |
| NEW_ROUND | Instant | Start next round |

### 👤 Player Actions

| Step | Action | Result |
|------|--------|--------|
| 1 | Select bet amount | Choose 50/100/200/500 |
| 2 | Choose BIG or SMALL | Make prediction |
| 3 | Tap ROLL | Place bet and roll dice |
| 4 | View result | Win or lose |
| 5 | Claim bonus | If triggered |
| 6 | Repeat | Continue playing |

---

## 5. Technical Architecture

### 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|------|------------|---------|----------|
| **Frontend** | React | 18.x | UI framework for Mini App |
| **State Management** | Zustand | 4.x | Lightweight state management |
| **Styling** | Tailwind CSS | 3.x | Utility-first styling |
| **Build Tool** | Vite | 5.x | Fast development build |
| **WebSocket Client** | Socket.io-client | 4.x | Real-time communication |

| **Backend Runtime** | Node.js | 20.x LTS | Server runtime |
| **WebSocket Server** | Socket.io | 4.x | Real-time server |
| **Framework** | Express | 4.x | HTTP API framework |
| **ORM** | Prisma | 5.x | Database ORM |
| **Validation** | Zod | 3.x | Schema validation |

| **Database** | PostgreSQL | 15.x | Primary data store |
| **Cache** | Redis | 7.x | Hot state, sessions |
| **Message Queue** | Kafka | 3.x | Event streaming |
| **Container** | Docker | 24.x | Application container |
| **Deployment** | Railway/Render | - | Cloud hosting |

### 🏗️ System Architecture
│                    Frontend                         │
│          (Telegram Mini App / React)                │
└─────────────────────┬──────────────────────────────┘
                      │
               WebSocket / HTTPS
                      │
┌─────────────────────▼──────────────────────────────┐
│                  API Gateway                       │
│          (Auth, Rate Limit, Routing)              │
└───────┬─────────────────────┬──────────────────────┘
        │                     │
┌───────▼──────┐      ┌───────▼──────┐
│ Game Service │      │ Player Svc  │
│ (Core Eng)  │      │ (Profile)  │
└──────┬──────┘      └──────┬──────┘
       │                    │
       │                    │
┌──────▼──────┐     ┌──────▼──────┐
│   Redis    │     │ PostgreSQL │
│ (Hot State)│     │ (Database) │
└───────────┘     └────────────┘
        │
        │
┌───────▼───────���─��─────────┐
│    Event Bus (Kafka)       │
│  - game.bet.placed         │
│  - game.round.started     │
│  - game.result.generated  │
│  - wallet.updated         │
└───────────────────────────┘
```

### 🔌 Communication Layer

| Channel | Purpose |
|---------|---------|
| WebSocket | Real-time game updates |
| REST API | Auth, profile, history |

### 🧠 Backend Services

#### 1. Game Engine Service

| Responsibility | Description |
|---------------|-------------|
| Round Management | Create, lock, close rounds |
| RNG | Secure random number generation |
| Settlement | Calculate payouts |
| Event Emission | Broadcast results |

#### 2. Player Service

| Responsibility | Description |
|---------------|-------------|
| Authentication | Validate Telegram users |
| Profile | Manage player data |
| Session | Track active sessions |

#### 3. Wallet Service

| Responsibility | Description |
|---------------|-------------|
| Balance | Manage coin balances |
| Transactions | Record all transactions |
| Atomic Updates | Prevent double-spending |

#### 4. Leaderboard Service

| Responsibility | Description |
|---------------|-------------|
| Real-time | Redis sorted set |
| Daily | DB snapshots |

### 📡 Data Flow for 10,000 Bets / 200ms

```
Players
   ↓ (WebSocket)
API Gateway
   ↓
Bet Collector (stateless)
   ↓
Redis (atomic writes)
   ↓
Kafka (event stream)
   ↓
Settlement Engine
   ↓
PostgreSQL (async write)
```

---

## 6. WebSocket Events

### 📤 Client → Server

#### 1. PLACE_BET

```json
{
  "event": "PLACE_BET",
  "round_id": 10452,
  "choice": "BIG",
  "amount": 100
}
```

#### 2. JOIN_GAME

```json
{
  "event": "JOIN_GAME"
}
```

#### 3. CLAIM_REWARD

```json
{
  "event": "CLAIM_REWARD"
}
```

### 📥 Server → Client

#### 1. GAME_STATE

```json
{
  "type": "GAME_STATE",
  "round_id": 10452,
  "phase": "BETTING_OPEN",
  "time_left": 6,
  "balance": 1200
}
```

#### 2. BET_ACCEPTED

```json
{
  "type": "BET_ACCEPTED",
  "status": "bet_accepted"
}
```

#### 3. BET_REJECTED

```json
{
  "type": "BET_REJECTED",
  "reason": "insufficient_balance"
}
```

#### 4. DICE_RESULT

```json
{
  "type": "DICE_RESULT",
  "dice": 5,
  "winner": "BIG"
}
```

#### 5. BET_SETTLEMENT

```json
{
  "type": "BET_SETTLEMENT",
  "amount": 100,
  "reward": 200,
  "result": "WIN"
}
```

#### 6. WALLET_UPDATE

```json
{
  "type": "WALLET_UPDATE",
  "balance": 1300,
  "change": "+100"
}
```

#### 7. NEW_ROUND_STARTED

```json
{
  "type": "NEW_ROUND_STARTED",
  "round_id": 10453,
  "time_left": 8
}
```

#### 8. LUCKY_PACKET_AVAILABLE

```json
{
  "type": "LUCKY_PACKET_AVAILABLE"
}
```

---

## 7. State Management

### 🎯 Round State Machine

```
INIT
  ↓
OPEN_BETS
  ↓
LOCKED
  ↓
ROLLING
  ↓
RESULT_CALCULATED
  ↓
SETTLEMENT
  ↓
CLOSED
```

### 💾 Redis Schema

#### Round State (Global)

```json
round_10452
{
  "bets_total": 45000,
  "players": 320,
  "phase": "BETTING_OPEN",
  "dice_result": null
}
```

#### Player State (Individual)

```json
player_123:session
{
  "balance": 1000,
  "current_bet": 100,
  "selected": "BIG",
  "win_streak": 3
}
```

### 🗄️ Database Schema

#### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID |
| telegram_id | BIGINT | Telegram user ID |
| username | VARCHAR | Username |
| total_coins | INTEGER | Total coins |
| level | INTEGER | Player level |
| created_at | TIMESTAMP | Creation time |

#### Transactions Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Transaction ID |
| user_id | UUID | User ID |
| round_id | INTEGER | Round ID |
| amount | INTEGER | Bet amount |
| choice | VARCHAR | BIG or SMALL |
| result | VARCHAR | WIN or LOSE |
| payout | INTEGER | Payout amount |
| timestamp | TIMESTAMP | Transaction time |

#### GameHistory Table

| Column | Type | Description |
|--------|------|-------------|
| round_id | INTEGER | Round ID |
| dice_result | INTEGER | Dice value |
| total_pool | INTEGER | Total bet pool |
| big_bets | INTEGER | Total BIG bets |
| small_bets | INTEGER | Total SMALL bets |
| timestamp | TIMESTAMP | Round time |

---

## 8. API Specifications

### 🌐 REST API Endpoints

#### POST /auth/telegram-login

**Request**

```json
{
  "initData": "string"
}
```

**Response**

```json
{
  "user_id": 12345,
  "wallet_balance": 1000,
  "session_token": "abc.jwt.token"
}
```

#### GET /user/profile

**Headers**

```
Authorization: Bearer <token>
```

**Response**

```json
{
  "user_id": 12345,
  "username": "player_one",
  "balance": 1200,
  "level": 3,
  "win_streak": 2
}
```

#### GET /game/history

**Headers**

```
Authorization: Bearer <token>
```

**Query**

```
?limit=20&offset=0
```

**Response**

```json
{
  "history": [
    {
      "round_id": 10450,
      "choice": "BIG",
      "amount": 100,
      "result": "WIN",
      "payout": 200
    }
  ]
}
```

#### GET /leaderboard

**Response**

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "top_player",
      "coins": 150000
    }
  ]
}
```

---

## 9. Security

### 🔐 Authentication

- Telegram initData validation
- Bot token verification
- Signature check

### 🎲 RNG Security

| Requirement | Implementation |
|--------------|-----------------|
| Secure RNG | /dev/urandom or crypto RNG |
| Audit Logs | All rolls logged |
| Replay Verification | Hash verification |
| Anomaly Detection | Kafka stream analysis |

### 💰 Anti-Cheat

| Measure | Description |
|---------|-------------|
| Bet Velocity | Check bet frequency |
| IP Fingerprint | Track device patterns |
| Balance Locking | Atomic Redis updates |
| Rate Limiting | API gateway limits |

---

## 10. Economy Model

### 💵 Virtual Currency

| Rule | Description |
|------|-------------|
| Coins ≠ Real Money | Virtual only |
| Rewards Limited | Daily caps |
| Free Plays | Capped daily |
| House Edge | Built into payouts |

### 📊 Payout Structure

| Outcome | Multiplier |
|---------|-----------|
| Win | 2x |
| Lose | 0x |

### 📈 RTP (Return to Player)

- Target RTP: 95%
- House Edge: 5%
- This ensures long-term profitability

### 🛡️ Safety Rules

1. **Daily Loss Limit**: Players can lose max 1000 coins/day initially
2. **Cool-down Period**: After loss limit, 24-hour cooldown
3. **Daily Bonus**: Free coins for daily login
4. **Minimum Balance**: Players bottom out at 100 coins minimum

---

## 📋 Implementation Checklist

### Phase 1: Core Game
- [ ] Game UI (React)
- [ ] WebSocket client
- [ ] Basic game logic
- [ ] Dice animation

### Phase 2: Backend
- [ ] Node.js server
- [ ] Redis integration
- [ ] PostgreSQL schema
- [ ] WebSocket server

### Phase 3: Advanced
- [ ] Leaderboard
- [ ] Bonus system
- [ ] Security layer
- [ ] Analytics

---

## 📚 References

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [React WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Redis Documentation](https://redis.io/docs/)

---

## 📝 Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-04-21 | Initial SPEC |

---

*Generated: 2026-04-21*


