# Backend Interview Questions & Answers
## BIG/SMALL Dice Game Platform

---

## Table of Contents

1. [Node.js Fundamentals](#1-nodejs-fundamentals)
2. [Express.js](#2-expressjs)
3. [REST API Design](#3-rest-api-design)
4. [WebSocket & Real-time](#4-websocket--real-time)
5. [Database - PostgreSQL](#5-database---postgresql)
6. [Database - Redis](#6-database---redis)
7. [Authentication & Security](#7-authentication--security)
8. [Microservices Architecture](#8-microservices-architecture)
9. [DevOps & Deployment](#9-devops--deployment)
10. [System Design](#10-system-design)
11. [Testing](#11-testing)
12. [Performance & Optimization](#12-performance--optimization)
13. [Game-Specific: Real-time Betting](#13-game-specific-real-time-betting)
14. [Game-Specific: Wallet & Economy](#14-game-specific-wallet--economy)
15. [Game-Specific: Telegram Integration](#15-game-specific-telegram-integration)
16. [Game-Specific: Anti-Cheat & Security](#16-game-specific-anti-cheat--security)
17. [Game-Specific: Analytics & Metrics](#17-game-specific-analytics--metrics)
18. [Game-Specific: Error Handling & Recovery](#18-game-specific-error-handling--recovery)
19. [Message Queues & Async Processing](#19-message-queues--async-processing)
20. [GraphQL](#20-graphql)
21. [TypeScript](#21-typescript)
22. [Logging & Monitoring](#22-logging--monitoring)
23. [API Design Patterns](#23-api-design-patterns)
24. [Design Patterns in Node.js](#24-design-patterns-in-nodejs)
25. [Advanced JavaScript](#25-advanced-javascript)
26. [Advanced Node.js](#26-advanced-nodejs)
27. [Security Advanced](#27-security-advanced)
28. [Data Structures & Algorithms](#28-data-structures--algorithms)
29. [Advanced Database](#29-advanced-database)

---

## 1. Node.js Fundamentals

### Q1: What is Node.js and how does it work?

**Answer:**

Node.js is a JavaScript runtime built on Chrome's V8 engine that uses an event-driven, non-blocking I/O model.

**How it works:**

```
┌─────────────────────────────┐
│        Node.js              │
│  ┌─────────────────────┐    │
│  │   V8 JavaScript    │    │
│  │      Engine        │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │   Event Loop       │    │
│  │  (libuv thread)    │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │   Non-blocking I/O │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Example from our game:**
```javascript
// Non-blocking: handles thousands of concurrent WebSocket connections
io.on('connection', (socket) => {
  socket.on('place-bet', (data) => {
    // Handle bet without blocking other players
    gameService.processBet(data);
  });
});
```

---

### Q2: Explain the Event Loop in Node.js

**Answer:**

The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations.

**Phases of Event Loop:**

```
┌────────────────────┐
│   ┌────────────┐   │
│   │   Timers   │   │  ← setTimeout, setInterval
│   └─────┬──────┘   │
│         │           │
│   ┌─────▼──────┐   │
│   │Pending CBs │   │  ← I/O callbacks deferred
│   └─────┬──────┘   │
│         │           │
│   ┌─────▼──────┐   │
│   │  Idle/Prep │   │  ← Internal use
│   └─────┬──────┘   │
│         │           │
│   ┌─────▼──────┐   │
│   │   Poll     │   │  ← I/O operations
│   └─────┬──────┘   │
│         │           │
│   ┌─────▼──────┐   │
│   │    Check   │   │  ← setImmediate
│   └─────┬──────┘   │
│         │           │
│   ┌─────▼──────┐   │
│   │Close CBs   │   │  ← socket.on('close')
│   └────────────┘   │
└────────────────────┘
```

**Example:**
```javascript
// This executes FIRST (timers phase)
setTimeout(() => console.log('1'), 0);

// This executes SECOND (check phase)
setImmediate(() => console.log('2'));

// This executes THIRD (next tick)
process.nextTick(() => console.log('3'));

// Output: 3, 1, 2
```

---

### Q3: What is the difference between process.nextTick() and setImmediate()?

**Answer:**

| Aspect | process.nextTick() | setImmediate() |
|--------|-------------------|-----------------|
| Phase | After current operation | Check phase |
| Priority | Higher | Lower |
| Use case | Immediate callbacks | Defer to next event loop |
| Microtask | Yes | No (macrotask) |

**Example:**
```javascript
process.nextTick(() => console.log('nextTick'));
setImmediate(() => console.log('immediate'));

console.log('sync');
// Output: sync, nextTick, immediate
```

---

### Q4: How do you handle errors in async Node.js code?

**Answer:**

**1. Try-Catch (only for sync code):**
```javascript
// Works for sync code
try {
  const result = JSON.parse(userInput);
} catch (err) {
  console.error('Parse error:', err.message);
}
```

**2. Callback Pattern:**
```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('File read error:', err);
    return;
  }
  console.log('Data:', data);
});
```

**3. Promise .catch():**
```javascript
fetchUser(userId)
  .then(user => processUser(user))
  .catch(err => console.error('Error:', err));
```

**4. Async-Await with Try-Catch:**
```javascript
async function handleBet(req, res) {
  try {
    const bet = await gameService.placeBet(req.user.id, req.body);
    res.json(bet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

**5. Express Global Error Handler:**
```javascript
// Must be last middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

### Q5: What is the purpose of module.exports vs exports?

**Answer:**

```javascript
// module.exports = explicit export
module.exports = UserService;

// exports = shorthand (adds to module.exports)
exports.getUser = () => {};
exports.createUser = () => {};

// These are equivalent:
module.exports = { getUser: ..., createUser: ... };
```

**Key difference:**
```javascript
// This WON'T work (breaks reference)
exports = myFunction;  // ❌ Wrong!

// This WORKS
module.exports = myFunction;  // ✅ Correct

// This WORKS (adding property)
exports.myFunction = myFunction;  // ✅ Correct
```

---

## 2. Express.js

### Q6: How does Express.js middleware work?

**Answer:**

Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function.

**Middleware Flow:**

```
Request
   │
   ▼
┌─────────────────────────────────────────┐
│  Middleware 1 (Auth)                    │
│  - Check token                          │
│  - Attach user to request               │
│         │                               │
│         ▼ (next())                      │
│  Middleware 2 (Validate)                │
│  - Validate request body                 │
│         │                               │
│         ▼ (next())                      │
│  Middleware 3 (Route Handler)           │
│  - Process request                      │
│         │                               │
│         ▼ (send response)               │
│  Response                               │
└─────────────────────────────────────────┘
```

**Example from our game:**
```javascript
// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Validation middleware
const validateBet = (req, res, next) => {
  const { amount, choice } = req.body;
  if (![50, 100, 200, 500].includes(amount)) {
    return res.status(400).json({ error: 'Invalid bet amount' });
  }
  if (!['BIG', 'SMALL'].includes(choice)) {
    return res.status(400).json({ error: 'Invalid choice' });
  }
  next();
};

// Usage
app.post('/api/game/place-bet', authMiddleware, validateBet, placeBetController);
```

---

### Q7: What is the difference between app.get() and app.use()?

**Answer:**

| Method | Purpose | Route Matching |
|--------|---------|----------------|
| `app.get()` | GET request handler | Exact path match |
| `app.post()` | POST request handler | Exact path match |
| `app.use()` | Any HTTP method | Middleware (runs on every request) |
| `app.all()` | Any HTTP method | Specific path |

**Example:**
```javascript
// Runs ONLY on GET /api/game
app.get('/api/game', (req, res) => {
  res.json({ status: 'ok' });
});

// Runs on EVERY request to /api
app.use('/api', (req, res, next) => {
  console.log('API called:', req.method, req.path);
  next();
});
```

---

### Q8: How do you handle 404 errors in Express?

**Answer:**

```javascript
// 1. Route not found (at the end of all routes)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// 2. Global error handler (must be LAST)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});
```

---

### Q9: Explain Express.js routing with parameters

**Answer:**

**Route Parameters:**
```javascript
// GET /api/player/123
app.get('/api/player/:id', (req, res) => {
  const playerId = req.params.id;
  // playerId = "123"
});

// Multiple parameters
// GET /api/game/123/bet/456
app.get('/api/game/:gameId/bet/:betId', (req, res) => {
  const { gameId, betId } = req.params;
});

// Optional parameters
// GET /api/leaderboard or GET /api/leaderboard/daily
app.get('/api/leaderboard/:type?', (req, res) => {
  const type = req.params.type || 'global';
});
```

**Query Parameters:**
```javascript
// GET /api/players?page=1&limit=10&sort=coins
app.get('/api/players', (req, res) => {
  const { page = 1, limit = 10, sort = 'coins' } = req.query;
  // page = "1", limit = "10", sort = "coins"
});
```

---

### Q10: How do you structure a large Express.js application?

**Answer:**

**Recommended Structure:**
```
backend/src/
├── config/           # Configuration
│   └── index.js
├── controllers/      # Request handlers (thin)
│   ├── auth.controller.js
│   └── game.controller.js
├── routes/          # Route definitions
│   ├── auth.routes.js
│   └── game.routes.js
├── services/        # Business logic (fat)
│   ├── auth.service.js
│   ├── game.service.js
│   └── wallet.service.js
├── models/          # Database models
│   ├── User.js
│   └── Bet.js
├── middleware/      # Custom middleware
│   ├── auth.middleware.js
│   └── error.middleware.js
├── database/        # Database connections
│   ├── prisma/
│   └── redis/
├── utils/           # Utilities
│   └── logger.js
└── index.js         # Entry point
```

**Controller (thin):**
```javascript
// game.controller.js
const gameService = require('../services/game.service');

const placeBet = async (req, res, next) => {
  try {
    const result = await gameService.placeBet(
      req.user.id,
      req.body.amount,
      req.body.choice
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { placeBet };
```

**Service (fat):**
```javascript
// game.service.js
class GameService {
  async placeBet(userId, amount, choice) {
    // 1. Validate bet
    // 2. Check balance
    // 3. Deduct from wallet
    // 4. Store bet
    // 5. Emit WebSocket event
    // Return result
  }
}
```

---

## 3. REST API Design

### Q11: What are RESTful API best practices?

**Answer:**

**1. Use Proper HTTP Methods:**
```javascript
// ✓ Correct
app.get('/api/players', getPlayers);      // Fetch
app.post('/api/bets', createBet);       // Create
app.put('/api/player/profile', updateProfile); // Update
app.delete('/api/bet/:id', deleteBet);   // Delete

// ✗ Wrong
app.get('/api/createBet', createBet);
```

**2. Use Proper Status Codes:**
```javascript
// Success codes
200 OK - Successful GET, PUT, DELETE
201 Created - Successful POST
204 No Content - Successful DELETE (no response body)

// Client error codes
400 Bad Request - Invalid input
401 Unauthorized - Not authenticated
403 Forbidden - Authenticated but not authorized
404 Not Found - Resource doesn't exist
422 Unprocessable Entity - Valid but business logic error

// Server error codes
500 Internal Server Error
503 Service Unavailable
```

**3. Consistent Response Format:**
```javascript
// Success response
res.status(200).json({
  success: true,
  data: { id: 1, username: 'player1', coins: 1000 },
  message: 'Player fetched successfully'
});

// Error response
res.status(400).json({
  success: false,
  error: {
    code: 'INSUFFICIENT_BALANCE',
    message: 'Not enough coins to place this bet'
  }
});

// Paginated response
res.status(200).json({
  success: true,
  data: bets,
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
});
```

---

### Q12: How do you implement pagination in REST API?

**Answer:**

**Query Parameters:**
```
GET /api/bets?page=2&limit=20
```

**Implementation:**
```javascript
// Controller
const getBets = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [bets, total] = await Promise.all([
    prisma.bet.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.bet.count()
  ]);

  res.json({
    data: bets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
};
```

**Cursor-based Pagination (for large datasets):**
```javascript
// Use cursor for better performance
app.get('/api/bets', async (req, res) => {
  const { cursor, limit = 10 } = req.query;
  
  const bets = await prisma.bet.findMany({
    take: limit + 1, // Fetch one extra to check if more exist
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: 'desc' }
  });

  const hasMore = bets.length > limit;
  const data = hasMore ? bets.slice(0, -1) : bets;

  res.json({
    data,
    nextCursor: hasMore ? data[data.length - 1].id : null
  });
});
```

---

### Q13: How do you version a REST API?

**Answer:**

**1. URL Path Versioning (most common):**
```javascript
// Version 1
app.get('/api/v1/game/state');
app.post('/api/v1/bets');

// Version 2
app.get('/api/v2/game/state');
app.post('/api/v2/bets');
```

**2. Header Versioning:**
```javascript
app.get('/api/game/state', (req, res) => {
  const version = req.headers['accept-version'] || 'v1';
  
  if (version === 'v2') {
    return res.json(v2Response);
  }
  res.json(v1Response);
});
```

**3. Query Parameter:**
```javascript
app.get('/api/game/state?version=2');
```

---

### Q14: What is HATEOAS in REST API?

**Answer:**

HATEOAS (Hypermedia as the Engine of Application State) provides links to related resources in the response.

**Example:**
```javascript
res.json({
  id: 'bet_123',
  amount: 100,
  choice: 'BIG',
  status: 'WIN',
  _links: {
    self: '/api/bets/bet_123',
    player: '/api/players/player_456',
    round: '/api/rounds/round_789'
  }
});
```

---

### Q15: How do you handle API rate limiting?

**Answer:**

**Using express-rate-limit:**
```javascript
const rateLimit = require('express-rate-limit');

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' }
});

// Strict limit for betting
const betLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 bets per minute
  keyGenerator: (req) => req.user.id, // Per user
  message: { error: 'Bet limit exceeded' }
});

app.use('/api/', apiLimiter);
app.post('/api/bets', betLimiter, placeBet);
```

**Custom Redis-based rate limiter:**
```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function rateLimiter(req, res, next) {
  const userId = req.user.id;
  const key = `ratelimit:${userId}`;
  
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 60 seconds window
  }
  
  if (current > 10) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  res.setHeader('X-RateLimit-Remaining', 10 - current);
  next();
}
```

---

## 4. WebSocket & Real-time

### Q16: How does Socket.io work?

**Answer:**

Socket.io is a library that enables real-time, bidirectional communication.

**Architecture:**
```
Client                      Server
   │                         │
   ├───── connect() ────────►│
   │                         │
   │◄──── handshake ────────┤
   │     (session ID)       │
   │                         │
   ├──── emit('event') ────►│
   │                         │
   │◄─── emit('response') ──┤
   │                         │
   ├──── disconnect() ─────►│
```

**Server Implementation:**
```javascript
const { Server } = require('socket.io');
const io = new Server(3000, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  // Join game room
  socket.on('join-game', (gameId) => {
    socket.join(`game:${gameId}`);
    io.to(`game:${gameId}`).emit('player-joined', { 
      playerId: socket.id 
    });
  });
  
  // Handle bet
  socket.on('place-bet', async (data) => {
    const result = await gameService.processBet(data);
    io.emit('bet-result', result);
  });
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});
```

**Client Implementation:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('game-state', (state) => {
  updateGameUI(state);
});

socket.emit('place-bet', { amount: 100, choice: 'BIG' });
```

---

### Q17: What is the difference between Socket.io and WebSocket?

**Answer:**

| Feature | WebSocket | Socket.io |
|---------|-----------|-----------|
| Connection | Single TCP connection | Multiple transports |
| Auto-reconnect | Manual implementation | Built-in |
| Fallback | None | Long-polling fallback |
| Rooms | Not supported | Supported |
| Broadcasting | Manual | Easy |
| Complexity | Low | Higher |

**When to use which:**
- **WebSocket:** Simple, low-latency needs, controlled environment
- **Socket.io:** Production apps, need reliability, cross-browser support

---

### Q18: How do you handle WebSocket rooms?

**Answer:**

Rooms allow grouping sockets:

```javascript
// Join room
socket.join(`game:${gameId}`);

// Send to specific room
io.to(`game:${gameId}`).emit('game-update', data);

// Send to everyone except sender
socket.to(`game:${gameId}`).emit('player-action', data);

// Leave room
socket.leave(`game:${gameId}`);

// Example: Game round management
class GameRoom {
  constructor(gameId, io) {
    this.gameId = gameId;
    this.io = io;
    this.players = new Map();
  }
  
  addPlayer(playerId, socket) {
    this.players.set(playerId, socket);
    socket.join(this.gameId);
  }
  
  broadcast(event, data) {
    this.io.to(this.gameId).emit(event, data);
  }
  
  removePlayer(playerId) {
    const socket = this.players.get(playerId);
    if (socket) {
      socket.leave(this.gameId);
      this.players.delete(playerId);
    }
  }
}
```

---

### Q19: How do you handle WebSocket reconnections?

**Answer:**

**Client-side:**
```javascript
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  // Re-sync game state
  socket.emit('sync-state');
});

socket.on('reconnect_failed', () => {
  console.log('Reconnection failed');
  // Show error to user
});
```

**Server-side:**
```javascript
io.on('connection', (socket) => {
  // Restore session
  const token = socket.handshake.auth.token;
  const user = jwt.verify(token);
  
  socket.userId = user.id;
  
  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    // Clean up resources
  });
});
```

---

### Q20: How do you scale WebSockets horizontally?

**Answer:**

**Using Redis Adapter:**
```javascript
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

**Architecture:**
```
                    ┌─────────────────┐
                    │   Load Balancer │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Socket.io #1 │    │  Socket.io #2 │    │  Socket.io #3 │
│    (Node)      │    │    (Node)      │    │    (Node)      │
└───────┬────────┘    └───────┬────────┘    └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │     Redis       │
                    │   (Pub/Sub)    │
                    └─────────────────┘
```

---

## 5. Database - PostgreSQL

### Q21: What is PostgreSQL and why use it?

**Answer:**

PostgreSQL is a powerful, open-source relational database.

**Why PostgreSQL for our game:**
- ACID compliance (critical for financial transactions)
- Complex queries support
- JSON support for flexible data
- Excellent concurrency (MVCC)
- Foreign keys, triggers, stored procedures

**Basic Operations:**
```javascript
// Using Prisma ORM
const user = await prisma.user.create({
  data: {
    telegramId: 123456789,
    username: 'player1',
    totalCoins: 1000
  }
});

const bets = await prisma.bet.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

---

### Q22: What is ACID in databases?

**Answer:**

ACID is a set of properties guarantees reliable transaction processing:

| Property | Description | Example in our game |
|----------|-------------|---------------------|
| **Atomicity** | All succeed or all fail | Bet placement: deduct balance + create bet record |
| **Consistency** | Valid state always | Balance never goes negative |
| **Isolation** | Concurrent transactions don't interfere | Two bets in same round handled correctly |
| **Durability** | Once committed, data persists | Won coins saved even after server restart |

**Example:**
```javascript
// This is atomic - either both succeed or both fail
await prisma.$transaction(async (tx) => {
  await tx.user.update({
    where: { id: userId },
    data: { totalCoins: { decrement: betAmount } }
  });
  
  await tx.bet.create({
    data: { userId, amount: betAmount, choice }
  });
});
```

---

### Q23: What are PostgreSQL indexes and how do they improve performance?

**Answer:**

Indexes are data structures that speed up data retrieval.

**Types of Indexes:**
```prisma
model User {
  id          String   @id
  telegramId  BigInt   @unique  // B-tree index (default)
  totalCoins  Int
  createdAt   DateTime
  
  // Composite index for common queries
  @@index([createdAt, totalCoins])
}

model Bet {
  id        String  @id
  userId    String
  roundId   String
  amount    Int
  
  // Index for finding user's bets in a round
  @@index([userId, roundId])
}
```

**When to use indexes:**
- WHERE clauses (userId, roundId)
- JOIN conditions
- ORDER BY columns
- Columns with high cardinality

**When NOT to use indexes:**
- Small tables
- Frequently updated columns
- Low cardinality columns (boolean)

---

### Q24: What is database normalization?

**Answer:**

Database normalization organizes data to reduce redundancy.

**Normal Forms:**

| NF | Description | Example |
|----|-------------|---------|
| 1NF | Atomic values, no lists in columns | `phone_numbers` table instead of comma-separated |
| 2NF | No partial dependencies | Separate `User` and `Bet` tables |
| 3NF | No transitive dependencies | `Round` table separate from `Bet` |

**Our Schema (Normalized):**
```
Users Table
├── id (PK)
├── telegramId
├── username
└── totalCoins

GameRounds Table
├── id (PK)
├── phase
├── diceResult
└── timestamps

Bets Table
├── id (PK)
├── userId (FK → Users)
├── roundId (FK → GameRounds)
├── amount
└── choice

Transactions Table
├── id (PK)
├── userId (FK → Users)
├── type (WIN/LOSE/BET)
└── amount
```

---

### Q25: How do you handle database migrations?

**Answer:**

**Prisma Migration:**
```bash
# Create migration
npx prisma migrate dev --name add_bet_version

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Check status
npx prisma migrate status
```

**Migration file example:**
```prisma
// prisma/migrations/20240101_create_users/migration.sql

CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    "telegramId" BIGINT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    "totalCoins" INTEGER DEFAULT 1000,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "user_telegramId_idx" ON "User"("telegramId");
```

---

### Q26: What is the difference between DELETE and TRUNCATE?

**Answer:**

| Command | DELETE | TRUNCATE |
|---------|--------|----------|
| Speed | Slower (row by row) | Faster (deallocates pages) |
| WHERE | Supports | Not supported |
| Triggers | Fires | Doesn't fire |
| IDENTITY | Preserved | Resets |
| Transaction | Can rollback | Can rollback |

**Usage:**
```sql
-- Delete specific rows
DELETE FROM bets WHERE roundId = 'old_round' AND createdAt < '2024-01-01';

-- Delete all rows (keep structure)
TRUNCATE TABLE test_bets RESTART IDENTITY;

-- Delete with condition in transaction
BEGIN;
DELETE FROM users WHERE id = 1;
INSERT INTO audit_log VALUES ('Deleted user 1', NOW());
COMMIT;
```

---

### Q27: How do you optimize slow SQL queries?

**Answer:**

**1. EXPLAIN ANALYZE:**
```sql
EXPLAIN ANALYZE 
SELECT * FROM bets 
WHERE userId = '123' 
ORDER BY createdAt DESC 
LIMIT 10;
```

**2. Add Indexes:**
```sql
CREATE INDEX CONCURRENTLY idx_bets_user_created 
ON bets(userId, createdAt DESC);
```

**3. Optimize Query:**
```javascript
// ❌ Slow: N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const bets = await prisma.bet.findMany({ 
    where: { userId: user.id } 
  });
}

// ✅ Fast: Single query with include
const users = await prisma.user.findMany({
  include: {
    bets: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

**4. Select only needed columns:**
```javascript
// ❌ Slow
const users = await prisma.user.findMany();

// ✅ Fast
const users = await prisma.user.findMany({
  select: { id: true, username: true }
});
```

---

## 6. Database - Redis

### Q28: What is Redis and when should you use it?

**Answer:**

Redis is an in-memory data structure store.

**When to use Redis:**
- Caching (reduce database load)
- Session storage
- Real-time features (leaderboards)
- Rate limiting
- Pub/Sub messaging

**When NOT to use Redis:**
- Primary data store (use PostgreSQL)
- Complex queries
- Data that must persist (without backup)

**Basic Operations:**
```javascript
const redis = require('ioredis');
const client = redis.createClient();

await client.set('player:123:balance', '1000');
const balance = await client.get('player:123:balance');

await client.hset('round:456', { 
  phase: 'OPEN_BETS', 
  pool: '5000' 
});
const round = await client.hgetall('round:456');

await client.zadd('leaderboard', 1000, 'player:123');
const topPlayers = await client.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
```

---

### Q29: What are Redis data types?

**Answer:**

| Type | Use Case | Example |
|------|----------|---------|
| String | Simple values, counters | `user:123:balance` |
| Hash | Objects | `{phase: 'OPEN', pool: 5000}` |
| List | Queues, history | `user:123:bets` |
| Set | Unique values | `game:123:players` |
| Sorted Set | Leaderboards | `leaderboard` (score: coins) |
| Bitmap | Flags, statistics | `user:123:login:2024-01-01` |
| HyperLogLog | Counting | `page:views` |

**Examples:**
```javascript
// String - counter
await client.incr('game:rounds:count');

// Hash - round data
await client.hset('round:123', 'diceResult', '4');
await client.hget('round:123', 'phase');

// List - recent bets
await client.lpush('user:123:bets', betId);
const recentBets = await client.lrange('user:123:bets', 0, 9);

// Set - players in game
await client.sadd('game:123:players', 'player1', 'player2');

// Sorted Set - leaderboard
await client.zadd('leaderboard:global', 1000, 'player:123');
await client.zrevrank('leaderboard:global', 'player:123'); // Get rank
```

---

### Q30: How does Redis Pub/Sub work?

**Answer:**

Pub/Sub enables message broadcasting:

```javascript
// Publisher
const publisher = redis.createClient();
publisher.publish('game:123:bets', JSON.stringify({
  type: 'NEW_BET',
  data: { player: 'player1', amount: 100 }
}));

// Subscriber
const subscriber = redis.createClient();
subscriber.subscribe('game:123:bets');

subscriber.on('message', (channel, message) => {
  if (channel === 'game:123:bets') {
    const data = JSON.parse(message);
    io.to('game:123').emit('new-bet', data);
  }
});
```

**Use in our game:**
```javascript
// Server 1: Handles bets
io.on('connection', (socket) => {
  socket.on('place-bet', async (data) => {
    await processBet(data);
    publisher.publish(`game:${data.roundId}`, JSON.stringify({
      type: 'BET_PLACED',
      data
    }));
  });
});

// Server 2: Broadcasts to WebSocket
const subscriber = redis.duplicate();
subscriber.subscribe('game:123');
subscriber.on('message', (channel, message) => {
  io.to(channel).emit('game-update', JSON.parse(message));
});
```

---

### Q31: How do you handle Redis connection failures?

**Answer:**

```javascript
const redis = require('ioredis');

const redisClient = redis.createClient({
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

// Graceful fallback
async function getBalance(userId) {
  try {
    return await redisClient.get(`player:${userId}:balance`);
  } catch (err) {
    console.error('Redis error, falling back to DB');
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user?.totalCoins;
  }
}
```

---

### Q32: What is Redis caching strategy?

**Answer:**

**Cache-Aside Pattern:**
```javascript
async function getPlayerProfile(playerId) {
  // 1. Check cache first
  const cached = await redis.get(`player:${playerId}:profile`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. Cache miss - get from database
  const player = await prisma.user.findUnique({
    where: { id: playerId }
  });
  
  // 3. Store in cache (5 minutes TTL)
  if (player) {
    await redis.setex(
      `player:${playerId}:profile`,
      300, // 5 minutes
      JSON.stringify(player)
    );
  }
  
  return player;
}
```

**Cache Invalidation:**
```javascript
async function updatePlayerBalance(playerId, newBalance) {
  await prisma.user.update({
    where: { id: playerId },
    data: { totalCoins: newBalance }
  });
  
  // Invalidate cache
  await redis.del(`player:${playerId}:balance`);
  await redis.del(`player:${playerId}:profile`);
}
```

---

## 7. Authentication & Security

### Q33: How does JWT authentication work?

**Answer:**

JWT (JSON Web Token) is a stateless authentication mechanism.

**JWT Structure:**
```
xxxxx.yyyyy.zzzzz
 │      │     │
 │      │     └── Signature (verifies integrity)
 │      └─────── Payload (claims/data)
 └─────────────── Header (token type, algorithm)
```

**Implementation:**
```javascript
const jwt = require('jsonwebtoken');

// Generate token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      telegramId: user.telegramId,
      username: user.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

**Payload Example:**
```javascript
{
  "id": "user_123",
  "telegramId": 123456789,
  "username": "player1",
  "iat": 1704067200,    // Issued at
  "exp": 1704672000     // Expiration (7 days)
}
```

---

### Q34: What is the difference between authentication and authorization?

**Answer:**

| Term | Meaning | Question |
|------|---------|----------|
| Authentication | Who are you? | "Are you logged in?" |
| Authorization | What can you do? | "Can you place a bet?" |

**Example:**
```javascript
// Authentication - Who are you?
app.post('/api/auth/login', async (req, res) => {
  const { telegramInitData } = req.body;
  const user = await verifyTelegramUser(telegramInitData);
  const token = generateToken(user);
  res.json({ token, user });
});

// Authorization - What can you do?
app.post('/api/bets', authenticateToken, async (req, res) => {
  // Check if user can bet (not banned, enough balance)
  const canBet = await checkBetPermission(req.user.id);
  if (!canBet) {
    return res.status(403).json({ error: 'Cannot place bet' });
  }
  // Place bet...
});
```

---

### Q35: How do you secure a REST API?

**Answer:**

**1. HTTPS:**
```javascript
// Use HTTPS in production
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(3000);
```

**2. Security Headers (Helmet):**
```javascript
const helmet = require('helmet');
app.use(helmet());

// Configure CSP for Telegram WebView
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    frameAncestors: ["'self'", 'https://*.telegram.org'],
  }
}));
```

**3. Input Validation:**
```javascript
const Joi = require('joi');

const betSchema = Joi.object({
  amount: Joi.number().integer().min(50).max(1000).required(),
  choice: Joi.string().valid('BIG', 'SMALL').required()
});

app.post('/api/bets', (req, res, next) => {
  const { error } = betSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
});
```

**4. Rate Limiting:**
```javascript
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

---

### Q36: What is CORS and how do you configure it?

**Answer:**

CORS (Cross-Origin Resource Sharing) controls which domains can access your API.

**Configuration:**
```javascript
const cors = require('cors');

// Allow specific origins
app.use(cors({
  origin: ['https://telegram.org', 'https://mygame.com'],
  credentials: true
}));

// Allow all (development only)
app.use(cors());

// For Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
```

---

### Q37: How do you handle password/secret storage?

**Answer:**

**Environment Variables:**
```bash
# .env file (never commit!)
JWT_SECRET=super-secret-key-12345
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_PASSWORD=redis-pass-123
TELEGRAM_BOT_TOKEN=12345:ABCDE
```

**In Code:**
```javascript
require('dotenv').config();

// Use in code
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

**Production - Secret Management:**
```javascript
// AWS Secrets Manager
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const client = new SecretsManagerClient({ region: 'us-east-1' });
const response = await client.send(new GetSecretValueCommand({
  SecretId: 'prod/jwt-secret'
}));
const { JWT_SECRET } = JSON.parse(response.SecretString);
```

---

### Q38: What is SQL injection and how to prevent it?

**Answer:**

SQL injection is when malicious code is inserted into SQL queries.

**Vulnerable Code:**
```javascript
// ❌ NEVER DO THIS
const query = `SELECT * FROM users WHERE id = '${req.body.id}'`;
await prisma.$queryRaw(query);
```

**Prevention with Prisma:**
```javascript
// ✅ Prisma automatically sanitizes inputs
const user = await prisma.user.findUnique({
  where: { id: req.body.id }  // Safe!
});

// ✅ Parameterized queries
await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
```

---

## 8. Microservices Architecture

### Q39: What is microservices architecture?

**Answer:**

Microservices is an architectural style where an application is built as a collection of small, independent services.

**vs Monolithic:**
```
Monolithic                    Microservices
┌─────────────────┐          ┌───┐  ┌───┐  ┌───┐
│                 │          │Auth│  │Game│  │User│
│  All code in    │          │Svc │  │Svc │  │Svc │
│  one application│          └───┘  └───┘  └───┘
│                 │             │     │     │
└─────────────────┘             └─────┴─────┘
                                    │
                              ┌─────┴─────┐
                              │  Gateway  │
                              └───────────┘
```

**Our Game Services:**
```
┌────────────────┐     ┌────────────────┐
│  Auth Service  │     │  Game Service  │
│  - Login       │     │  - Betting     │
│  - JWT         │     │  - Rolling     │
└────────────────┘     └────────────────┘
          │                      │
          └──────────┬───────────┘
                     │
            ┌────────▼────────┐
            │  Game Gateway   │
            └─────────────────┘
```

---

### Q40: How do services communicate?

**Answer:**

**1. Synchronous (REST/gRPC):**
```javascript
// HTTP call between services
const axios = require('axios');

async function getUserWithProfile(userId) {
  const [user, profile] = await Promise.all([
    axios.get(`http://user-service/api/users/${userId}`),
    axios.get(`http://profile-service/api/profiles/${userId}`)
  ]);
  return { ...user.data, ...profile.data };
}
```

**2. Asynchronous (Message Queue):**
```javascript
// Using RabbitMQ/Kafka
await channel.sendToQueue('bet_placed', Buffer.from(JSON.stringify({
  betId: '123',
  amount: 100,
  userId: 'user_1'
})));

// Consumer
channel.consume('bet_placed', async (msg) => {
  const bet = JSON.parse(msg.content.toString());
  await processBet(bet);
  channel.ack(msg);
});
```

---

### Q41: What is API Gateway?

**Answer:**

API Gateway is a single entry point for all clients.

**Responsibilities:**
- Request routing
- Authentication
- Rate limiting
- Response aggregation
- Protocol translation

**Implementation:**
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Route to auth service
app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true
}));

// Route to game service
app.use('/api/game', createProxyMiddleware({
  target: 'http://game-service:3002',
  changeOrigin: true
}));

// Route to user service
app.use('/api/user', createProxyMiddleware({
  target: 'http://user-service:3003',
  changeOrigin: true
}));

app.listen(3000);
```

---

## 9. DevOps & Deployment

### Q42: How do you containerize a Node.js application?

**Answer:**

**Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json .

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**docker-compose.yml:**
```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://db:5432/game
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
```

---

### Q43: What is Docker Compose?

**Answer:**

Docker Compose defines and runs multi-container applications.

**compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: game
      POSTGRES_PASSWORD: pass123
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U game"]
      interval: 10s
      timeout: 5s

  redis:
    image: redis:7
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

**Commands:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

---

### Q44: How do you set up CI/CD?

**Answer:**

**GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Test Backend
        run: |
          cd backend
          npm ci
          npm test
      
      - name: Test Frontend
        run: |
          cd frontend
          npm ci
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d
```

---

### Q45: How do you monitor a Node.js application?

**Answer:**

**1. Logging (Winston):**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in code
logger.info('Bet placed', { userId, amount, roundId });
logger.error('Payment failed', { error: err.message });
```

**2. Health Checks:**
```javascript
app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    redis.ping()
  ]);
  
  const healthy = checks.every(c => c.status === 'fulfilled');
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      database: checks[0].status === 'fulfilled' ? 'up' : 'down',
      redis: checks[1].status === 'fulfilled' ? 'up' : 'down'
    }
  });
});
```

**3. Monitoring Tools:**
- Prometheus + Grafana (metrics)
- Sentry (error tracking)
- New Relic (APM)

---

## 10. System Design

### Q46: How do you design a real-time gaming system?

**Answer:**

**Architecture:**
```
                    ┌─────────────────┐
                    │  Telegram API   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Mini App      │
                    │   (Frontend)    │
                    └────────┬────────┘
                             │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │   REST    │   │  WebSocket │   │  WebSocket│
        │   (Auth)  │   │  (Game 1)  │   │  (Game 2) │
        └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                    ┌────────▼────────┐
                    │   Load Balancer  │
                    └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │ Server #1 │   │ Server #2 │   │ Server #3 │
        │           │   │           │   │           │
        └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │ PostgreSQL│   │   Redis   │   │   Redis   │
        │  (Data)   │   │  (Cache)  │   │  (Pub/Sub)│
        └───────────┘   └───────────┘   └───────────┘
```

**Key Design Decisions:**
1. **Stateless servers** - Allows horizontal scaling
2. **Redis for real-time** - Fast state management
3. **PostgreSQL for persistence** - ACID compliance
4. **WebSocket for updates** - Real-time communication

---

### Q47: How do you handle high concurrency in betting?

**Answer:**

**1. Optimistic Locking:**
```javascript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id: userId } });
  
  if (user.totalCoins < betAmount) {
    throw new Error('Insufficient balance');
  }
  
  const result = await tx.user.updateMany({
    where: { id: userId, version: user.version },
    data: { 
      totalCoins: { decrement: betAmount },
      version: { increment: 1 }
    }
  });
  
  if (result.count === 0) {
    throw new Error('Concurrent modification. Retry.');
  }
});
```

**2. Rate Limiting:**
```javascript
const betLimiter = rateLimit({
  windowMs: 1000,
  max: 5, // 5 bets per second per user
  keyGenerator: (req) => req.user.id
});
```

**3. Queue-based Processing:**
```javascript
// Accept bet, process async
app.post('/api/bets', async (req, res) => {
  const betId = await queue.add('process-bet', req.body);
  res.json({ status: 'pending', betId: betId.id });
});

// Worker processes bets
worker.process('process-bet', async (job) => {
  await processBet(job.data);
});
```

---

### Q48: How do you ensure data consistency?

**Answer:**

**1. Database Transactions:**
```javascript
// All or nothing
await prisma.$transaction(async (tx) => {
  // Deduct balance
  await tx.user.update({
    where: { id: userId },
    data: { totalCoins: { decrement: amount } }
  });
  
  // Create bet
  await tx.bet.create({
    data: { userId, amount, choice }
  });
  
  // Update round pool
  await tx.gameRound.update({
    where: { id: roundId },
    data: { totalPool: { increment: amount } }
  });
});
```

**2. Idempotency:**
```javascript
// Use unique constraint + retry
async function placeBet(userId, roundId, amount) {
  try {
    await prisma.bet.create({
      data: { 
        userId, 
        roundId, 
        amount,
        // Prevents duplicate bets
        idempotencyKey: `${userId}:${roundId}` 
      }
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return { error: 'Bet already placed' };
    }
    throw err;
  }
}
```

---

### Q49: What is CAP theorem?

**Answer:**

CAP theorem states you can only guarantee 2 of 3:

| Property | Description |
|----------|-------------|
| **Consistency** | All nodes see same data |
| **Availability** | Every request gets response |
| **Partition Tolerance** | System works despite network failures |

**In Practice:**
- **CP** (Consistency + Partition Tolerance): Databases like MongoDB, PostgreSQL
- **AP** (Availability + Partition Tolerance): Cassandra, DynamoDB

**For our betting game:**
- Use PostgreSQL (CP) for financial data - consistency is critical
- Use Redis (AP) for caching - can tolerate eventual consistency

---

### Q50: How do you design for failure?

**Answer:**

**1. Circuit Breaker:**
```javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

const breaker = new CircuitBreaker(paymentService.process, options);

breaker.fire(amount)
  .then(result => res.json(result))
  .catch(err => {
    if (breaker.status === 'OPEN') {
      return res.status(503).json({ error: 'Service temporarily unavailable' });
    }
    res.status(500).json({ error: err.message });
  });
```

**2. Retry with Exponential Backoff:**
```javascript
async function retry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

**3. Fallback:**
```javascript
async function getBalance(userId) {
  try {
    // Try Redis first
    const cached = await redis.get(`balance:${userId}`);
    if (cached) return parseInt(cached);
    
    // Fallback to database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalCoins: true }
    });
    return user.totalCoins;
  } catch (err) {
    // Ultimate fallback
    logger.error('Balance fetch failed', err);
    return 0;
  }
}
```

---

## 11. Testing

### Q51: What are the types of testing?

**Answer:**

| Type | Purpose | Example |
|------|---------|---------|
| Unit | Test single function | Test `calculatePayout()` |
| Integration | Test component interaction | Test API + Database |
| E2E | Test full user flow | Test betting flow |
| Load | Test performance | 1000 concurrent users |

**Test Pyramid:**
```
        ╱╲
       ╱  ╲
      ╱ E2E╲
     ╱──────╲
    ╱Integration╲
   ╱───────────╲
  ╱   Unit      ╲
 ╱───────────────╲
```

---

### Q52: How do you write unit tests?

**Answer:**

**Jest Example:**
```javascript
// game.service.test.js

describe('GameService', () => {
  describe('calculatePayout', () => {
    it('should return 2x for winning bet', () => {
      const result = calculatePayout(100, 'BIG', 'BIG');
      expect(result).toBe(200);
    });
    
    it('should return 0 for losing bet', () => {
      const result = calculatePayout(100, 'BIG', 'SMALL');
      expect(result).toBe(0);
    });
    
    it('should calculate net profit correctly', () => {
      const result = calculateNetProfit(100, 200);
      expect(result).toBe(100); // 200 - 100
    });
  });
  
  describe('determineWinner', () => {
    it('should return BIG for 4, 5, 6', () => {
      expect(determineWinner(4)).toBe('BIG');
      expect(determineWinner(5)).toBe('BIG');
      expect(determineWinner(6)).toBe('BIG');
    });
    
    it('should return SMALL for 1, 2, 3', () => {
      expect(determineWinner(1)).toBe('SMALL');
      expect(determineWinner(2)).toBe('SMALL');
      expect(determineWinner(3)).toBe('SMALL');
    });
  });
});
```

**Running tests:**
```bash
npm test
npm test -- --coverage
```

---

### Q53: How do you test APIs?

**Answer:**

**Supertest Example:**
```javascript
const request = require('supertest');
const app = require('../app');

describe('POST /api/bets', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ telegramId: '123456' });
    authToken = res.body.token;
  });
  
  it('should place a bet with valid data', async () => {
    const res = await request(app)
      .post('/api/bets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 100, choice: 'BIG' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('betId');
  });
  
  it('should reject invalid bet amount', async () => {
    const res = await request(app)
      .post('/api/bets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 25, choice: 'BIG' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid bet amount');
  });
});
```

---

## 12. Performance & Optimization

### Q54: How do you optimize Node.js performance?

**Answer:**

**1. Use Fastify instead of Express (optional):**
```javascript
// Express: ~15k req/s
// Fastify: ~40k req/s
const fastify = require('fastify')();
await fastify.register(require('@fastify/cors'));
fastify.get('/api/health', () => ({ status: 'ok' }));
```

**2. Cluster Mode:**
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(3000);
}
```

**3. Enable Compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

---

### Q55: How do you handle memory leaks in Node.js?

**Answer:**

**1. Use heapdump:**
```javascript
const heapdump = require('heapdump');

app.get('/debug/heapdump', (req, res) => {
  heapdump.writeSnapshot((err, filename) => {
    res.json({ filename });
  });
});
```

**2. Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Unclosed connections | Use connection pooling |
| Event listeners | Remove listeners after use |
| Closures holding references | Clear references in callbacks |
| Large caches | Set TTL for cache |

**3. Monitor with clinic.js:**
```bash
clinic doctor -- node server.js
clinic flame -- node server.js
```

---

### Q56: What is connection pooling?

**Answer:**

Connection pooling reuses database connections instead of creating new ones for each request.

**Prisma:**
```javascript
// Default pool: 5 connections
const prisma = new PrismaClient();

// Configure pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?pool_timeout=10'
    }
  }
});
```

**PostgreSQL (pg):**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const result = await pool.query('SELECT * FROM users');
```

---

### Q57: How do you optimize database queries?

**Answer:**

**1. Select Only Needed Columns:**
```javascript
// ❌ Slow
const users = await prisma.user.findMany();

// ✅ Fast
const users = await prisma.user.findMany({
  select: { id: true, username: true }
});
```

**2. Use Indexes:**
```sql
CREATE INDEX CONCURRENTLY idx_bets_user_round 
ON bets(user_id, round_id);
```

**3. Batch Operations:**
```javascript
// ❌ Slow - N queries
for (const user of users) {
  await prisma.user.update({...});
}

// ✅ Fast - 1 query
await prisma.user.updateMany({
  where: { id: { in: users.map(u => u.id) } },
  data: { status: 'active' }
});
```

---

### Q58: What is caching and how do you implement it?

**Answer:**

**Types of Caching:**

| Level | Description | Example |
|-------|-------------|---------|
| CDN | Static assets | CloudFront |
| API Response | API results | Redis |
| Database Query | Query results | Redis |
| Application | In-memory | Node cache |

**Implementation:**
```javascript
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 }); // 60 seconds

// Get or fetch
async function getLeaderboard(forceRefresh = false) {
  const cacheKey = 'leaderboard:global';
  
  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }
  
  const leaders = await prisma.user.findMany({
    orderBy: { totalCoins: 'desc' },
    take: 10
  });
  
  cache.set(cacheKey, leaders, 30);
  return leaders;
}
```

---

### Q59: How do you handle session management?

**Answer:**

**JWT (Stateless):**
```javascript
// Token in memory or localStorage
const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });

// Client stores token
localStorage.setItem('token', token);

// Send with each request
axios.get('/api/user', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Redis Session:**
```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 86400000 }
}));
```

---

### Q60: What are some Node.js best practices?

**Answer:**

1. **Use Async/Await over Callbacks:**
```javascript
// ✅ Good
async function getData() {
  const result = await db.query();
  return result;
}

// ❌ Avoid
function getData(callback) {
  db.query((err, result) => callback(result));
}
```

2. **Handle Errors in Async:**
```javascript
// ✅ Good
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

3. **Use Environment Variables:**
```javascript
// ✅ Good
const port = process.env.PORT || 3000;

// ❌ Avoid
const port = 3000;
```

4. **Keep Dependencies Updated:**
```bash
npm audit fix
npm update
```

5. **Use Production Flags:**
```javascript
// Development only code
if (process.env.NODE_ENV !== 'production') {
  app.use('/dev', devRoutes);
}
```

---

## Summary

This document covers 60 essential backend interview questions for a real-time gaming platform developer position. Key topics include:

- **Node.js/Express** - Fundamentals, middleware, routing
- **REST API** - Design, versioning, pagination
- **WebSocket** - Socket.io, real-time communication
- **Databases** - PostgreSQL, Redis, caching
- **Security** - JWT, HTTPS, input validation
- **DevOps** - Docker, CI/CD, monitoring
- **System Design** - Scalability, concurrency
- **Testing** - Unit, integration, E2E
- **Performance** - Optimization, caching

## 13. Game-Specific: Real-time Betting

### Q61: How do you handle concurrent bet placement in a round?

### Q61: How do you handle concurrent bet placement in a round?

**Answer:**

In a real-time game, multiple users can place bets simultaneously. Here's how to handle it:

**1. Optimistic Locking:**
```javascript
async function placeBet(userId, roundId, amount, choice) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    
    if (user.totalCoins < amount) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
    
    // Atomic update
    const result = await tx.user.updateMany({
      where: { id: userId, totalCoins: { gte: amount } },
      data: { totalCoins: { decrement: amount } }
    });
    
    if (result.count === 0) {
      throw new Error('BALANCE_CHANGED');
    }
    
    // Create bet
    return await tx.bet.create({
      data: { userId, roundId, amount, choice }
    });
  });
}
```

**2. Redis-based Rate Limiting:**
```javascript
async function canPlaceBet(userId, roundId) {
  const key = `bet:${roundId}:${userId}`;
  const exists = await redis.setnx(key, '1');
  if (!exists) {
    return { allowed: false, reason: 'ALREADY_BET' };
  }
  await redis.expire(key, 60);
  return { allowed: true };
}
```

---

### Q62: How do you ensure fair dice rolling?

**Answer:**

Fairness is critical in gambling games. Here's the implementation:

**1. Crypto-secure Randomness:**
```javascript
function rollDice() {
  // Use crypto.getRandomValues for true randomness
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  
  // Map to 1-6 range uniformly
  const dice = (array[0] % 6) + 1;
  return dice;
}
```

**2. Server-side Only:**
```javascript
// Dice is ALWAYS generated on server
// Client NEVER sees result until server broadcasts
class GameService {
  async rollDice(roundId) {
    const dice = crypto.getRandomValues(new Uint32Array(1))[0] % 6 + 1;
    
    // Store encrypted result
    await redis.set(`round:${roundId}:result`, encrypt(dice));
    
    // Broadcast to all players
    io.to(`game:${roundId}`).emit('dice_rolling');
    
    // Wait for animation
    await sleep(3000);
    
    // Reveal result
    const result = decrypt(await redis.get(`round:${roundId}:result`));
    io.to(`game:${roundId}`).emit('dice_result', { dice: result });
    
    return result;
  }
}
```

**3. Audit Trail:**
```javascript
// Log all dice rolls for auditing
await prisma.diceRoll.create({
  data: {
    roundId,
    diceValue: dice,
    hash: crypto.createHash('sha256').update(`${dice}:${secret}`).digest('hex'),
    timestamp: new Date()
  }
});
```

---

### Q63: How do you handle round timing?

**Answer:**

The game has strict timing phases:

```javascript
class RoundManager {
  constructor(roundId, io) {
    this.roundId = roundId;
    this.io = io;
    this.phases = {
      OPEN_BETS: 8000,   // 8 seconds
      LOCKED: 500,      // 0.5 seconds
      ROLLING: 3000,    // 3 seconds
      SETTLEMENT: 1000, // 1 second
    };
  }
  
  async start() {
    // Phase 1: Open Bets
    await this.setPhase('OPEN_BETS');
    await this.broadcastTimer();
    
    // Wait for betting duration
    await this.wait(this.phases.OPEN_BETS);
    
    // Phase 2: Lock Bets
    await this.setPhase('LOCKED');
    await this.wait(this.phases.LOCKED);
    
    // Phase 3: Rolling
    await this.setPhase('ROLLING');
    const dice = await this.rollDice();
    await this.wait(this.phases.ROLLING);
    
    // Phase 4: Settlement
    await this.setPhase('SETTLEMENT');
    await this.settleBets(dice);
    await this.wait(this.phases.SETTLEMENT);
    
    // Start next round
    await this.setPhase('CLOSED');
    this.startNextRound();
  }
  
  async broadcastTimer() {
    let timeLeft = this.phases.OPEN_BETS / 1000;
    const interval = setInterval(() => {
      this.io.to(`game:${this.roundId}`).emit('timer', { timeLeft });
      timeLeft--;
      if (timeLeft < 0) clearInterval(interval);
    }, 1000);
  }
}
```

---

### Q64: How do you prevent betting after round closes?

**Answer:**

**1. Server-side Check:**
```javascript
async function placeBet(userId, roundId, amount, choice) {
  // Get current round state
  const round = await redis.hgetall(`round:${roundId}`);
  
  if (round.phase !== 'OPEN_BETS') {
    throw new Error('BETTING_CLOSED');
  }
  
  // Double-check timestamp
  const roundStart = parseInt(round.startTime);
  const now = Date.now();
  const elapsed = now - roundStart;
  
  if (elapsed > 8000) { // 8 seconds
    throw new Error('BETTING_CLOSED');
  }
  
  // Proceed with bet
}
```

**2. Redis Atomic Check:**
```javascript
async function canAcceptBet(roundId) {
  const result = await redis.eval(`
    local phase = redis.call('HGET', 'round:' .. KEYS[1], 'phase')
    if phase == 'OPEN_BETS' then
      return 1
    end
    return 0
  `, 1, roundId);
  
  return result === 1;
}
```

---

### Q65: How do you calculate and distribute winnings?

**Answer:**

```javascript
async function settleBets(roundId, dice) {
  const winner = [4, 5, 6].includes(dice) ? 'BIG' : 'SMALL';
  
  // Get all bets for this round
  const bets = await prisma.bet.findMany({
    where: { roundId }
  });
  
  // Process each bet
  for (const bet of bets) {
    const isWin = bet.choice === winner;
    const payout = isWin ? bet.amount * 2 : 0;
    
    await prisma.$transaction(async (tx) => {
      // Update bet result
      await tx.bet.update({
        where: { id: bet.id },
        data: { result: isWin ? 'WIN' : 'LOSE', payout }
      });
      
      // Update user balance
      if (payout > 0) {
        await tx.user.update({
          where: { id: bet.userId },
          data: { totalCoins: { increment: payout } }
        });
      }
      
      // Record transaction
      await tx.transaction.create({
        data: {
          userId: bet.userId,
          roundId,
          amount: payout,
          type: isWin ? 'WIN' : 'LOSE',
          balanceAfter: await getBalance(bet.userId)
        }
      });
    });
    
    // Notify user via WebSocket
    io.to(`user:${bet.userId}`).emit('bet_settled', {
      betId: bet.id,
      result: isWin ? 'WIN' : 'LOSE',
      payout
    });
  }
}
```

---

## 14. Game-Specific: Wallet & Economy

### Q66: How do you handle player wallet balance?

**Answer:**

```javascript
class WalletService {
  async getBalance(userId) {
    // Try Redis first
    const cached = await redis.get(`player:${userId}:balance`);
    if (cached) return parseInt(cached);
    
    // Fallback to database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalCoins: true }
    });
    
    await redis.setex(`player:${userId}:balance`, 60, user.totalCoins);
    return user.totalCoins;
  }
  
  async addCoins(userId, amount, reason) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { totalCoins: { increment: amount } }
    });
    
    // Invalidate cache
    await redis.del(`player:${userId}:balance`);
    
    // Log transaction
    await this.logTransaction(userId, amount, reason);
    
    return user.totalCoins;
  }
  
  async deductCoins(userId, amount, reason) {
    const user = await prisma.user.updateMany({
      where: { id: userId, totalCoins: { gte: amount } },
      data: { totalCoins: { decrement: amount } }
    });
    
    if (user.count === 0) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
    
    await redis.del(`player:${userId}:balance`);
    await this.logTransaction(userId, -amount, reason);
    
    return true;
  }
}
```

---

### Q67: How do you implement daily loss limits?

**Answer:**

```javascript
class LossLimitService {
  async checkDailyLimit(userId, betAmount) {
    const today = new Date().toISOString().split('T')[0];
    const key = `dailyloss:${userId}:${today}`;
    
    const todayLoss = parseInt(await redis.get(key) || '0');
    const limit = 1000; // Max 1000 coins loss per day
    
    if (todayLoss + betAmount > limit) {
      return { allowed: false, remaining: limit - todayLoss };
    }
    
    return { allowed: true, limit, todayLoss };
  }
  
  async recordLoss(userId, amount) {
    const today = new Date().toISOString().split('T')[0];
    const key = `dailyloss:${userId}:${today}`;
    
    await redis.incrby(key, amount);
    await redis.expire(key, 86400); // 24 hours
  }
  
  async resetDailyLimit(userId) {
    const today = new Date().toISOString().split('T')[0];
    const key = `dailyloss:${userId}:${today}`;
    await redis.set(key, '0');
  }
}
```

---

### Q68: How do you implement daily bonus?

**Answer:**

```javascript
class BonusService {
  async claimDailyBonus(userId) {
    const lastClaim = await this.getLastClaimDate(userId);
    const now = new Date();
    
    // Check if already claimed today
    if (this.isSameDay(lastClaim, now)) {
      throw new Error('ALREADY_CLAIMED_TODAY');
    }
    
    // Check streak
    const streak = await this.calculateStreak(userId, lastClaim);
    const bonus = this.calculateBonus(streak);
    
    // Add bonus to wallet
    await walletService.addCoins(userId, bonus, 'DAILY_BONUS');
    
    // Update claim date
    await this.setLastClaimDate(userId, now);
    
    return { bonus, streak, nextClaimTime: this.getNextClaimTime(now) };
  }
  
  calculateBonus(streak) {
    const bonuses = {
      0: 100,   // Day 1
      1: 150,   // Day 2
      2: 200,   // Day 3
      3: 300,   // Day 4
      4: 500,   // Day 5
      5: 1000,  // Day 6
      6: 2000,  // Day 7 (max)
    };
    return bonuses[Math.min(streak, 6)];
  }
}
```

---

### Q69: How do you handle player levels?

**Answer:**

```javascript
class LevelService {
  calculateLevel(totalCoins) {
    const levels = [
      { level: 1, min: 0 },
      { level: 2, min: 1000 },
      { level: 3, min: 5000 },
      { level: 4, min: 10000 },
      { level: 5, min: 50000 },
      { level: 6, min: 100000 },
      { level: 7, min: 500000 },
    ];
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalCoins >= levels[i].min) {
        return levels[i].level;
      }
    }
    return 1;
  }
  
  getLevelBenefits(level) {
    const benefits = {
      1: { bonus: 0, icon: '🌱' },
      2: { bonus: 50, icon: '🌿' },
      3: { bonus: 100, icon: '🌳' },
      4: { bonus: 200, icon: '🔥' },
      5: { bonus: 500, icon: '⚡' },
      6: { bonus: 1000, icon: '💎' },
      7: { bonus: 2000, icon: '👑' },
    };
    return benefits[level];
  }
}
```

---

### Q70: How do you implement leaderboard rankings?

**Answer:**

```javascript
class LeaderboardService {
  async updateScore(userId, coins) {
    // Update Redis sorted set
    await redis.zadd('leaderboard:global', coins, userId);
    
    // Update daily leaderboard
    const today = new Date().toISOString().split('T')[0];
    await redis.zadd(`leaderboard:${today}`, coins, userId);
  }
  
  async getGlobalRank(userId) {
    const rank = await redis.zrevrank('leaderboard:global', userId);
    const score = await redis.zscore('leaderboard:global', userId);
    return { rank: rank + 1, score };
  }
  
  async getTopPlayers(limit = 10) {
    const players = await redis.zrevrange('leaderboard:global', 0, limit - 1, 'WITHSCORES');
    
    const result = [];
    for (let i = 0; i < players.length; i += 2) {
      const userId = players[i];
      const score = parseInt(players[i + 1]);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true }
      });
      result.push({
        rank: (i / 2) + 1,
        username: user.username,
        coins: score
      });
    }
    return result;
  }
  
  async getDailyRank(userId) {
    const today = new Date().toISOString().split('T')[0];
    const rank = await redis.zrevrank(`leaderboard:${today}`, userId);
    return rank !== null ? rank + 1 : null;
  }
}
```

---

## 15. Game-Specific: Telegram Integration

### Q71: How do you authenticate Telegram users?

**Answer:**

```javascript
const crypto = require('crypto');

async function verifyTelegramAuth(initData) {
  // Parse initData
  const params = new URLSearchParams(initData);
  const data = {};
  for (const [key, value] of params) {
    data[key] = value;
  }
  
  // Verify hash
  const hash = data.hash;
  delete data.hash;
  
  // Sort keys
  const sortedKeys = Object.keys(data).sort();
  const dataCheckString = sortedKeys
    .map(key => `${key}=${data[key]}`)
    .join('\n');
  
  // Create secret key
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();
  
  // Calculate hash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  if (calculatedHash !== hash) {
    throw new Error('INVALID_HASH');
  }
  
  // Parse user data
  const user = JSON.parse(data.user);
  
  return {
    telegramId: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name
  };
}
```

---

### Q72: How do you handle Telegram Mini App initialization?

**Answer:**

```javascript
app.post('/api/auth/telegram-login', async (req, res) => {
  try {
    const { initData } = req.body;
    
    // Verify Telegram auth
    const telegramUser = await verifyTelegramAuth(initData);
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { telegramId: telegramUser.telegramId }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: telegramUser.telegramId,
          username: telegramUser.username || `user_${telegramUser.telegramId}`,
          totalCoins: 1000 // Initial balance
        }
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, telegramId: user.telegramId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        balance: user.totalCoins
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});
```

---

### Q73: How do you send notifications to Telegram users?

**Answer:**

```javascript
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

class NotificationService {
  async sendWinNotification(userId, amount) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Get Telegram chat ID (stored in user data)
    if (user.telegramChatId) {
      await bot.sendMessage(
        user.telegramChatId,
        `🎉 Congratulations! You won ${amount} coins!`,
        { reply_markup: { inline_keyboard: [[{ text: 'Play Again', web_app: { url: 'https://...' } }]] } }
      );
    }
  }
  
  async sendDailyBonusNotification(userId, bonus) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user.telegramChatId) {
      await bot.sendMessage(
        user.telegramChatId,
        `🎁 Daily Bonus: +${bonus} coins!\nCome back tomorrow for more!`
      );
    }
  }
}
```

---

## 16. Game-Specific: Anti-Cheat & Security

### Q74: How do you detect suspicious betting patterns?

**Answer:**

```javascript
class AntiCheatService {
  async analyzeBetPattern(userId, bet) {
    const flags = [];
    
    // Check for rapid betting
    const recentBets = await this.getRecentBets(userId, 10);
    if (recentBets.length >= 10) {
      const timeDiff = recentBets[0].createdAt - recentBets[9].createdAt;
      if (timeDiff < 5000) { // 10 bets in 5 seconds
        flags.push('RAPID_BETTING');
      }
    }
    
    // Check for exact same amounts
    const amounts = recentBets.map(b => b.amount);
    if (amounts.every(a => a === amounts[0])) {
      flags.push('SUSPICIOUS_PATTERN');
    }
    
    // Check for max bets every round
    const maxBetRounds = await this.countMaxBetRounds(userId);
    if (maxBetRounds > 20) {
      flags.push('ALWAYS_MAX_BET');
    }
    
    // Log for review
    if (flags.length > 0) {
      await this.logSuspiciousActivity(userId, flags, bet);
    }
    
    return flags;
  }
  
  async banUser(userId, reason) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'BANNED', banReason: reason }
    });
  }
}
```

---

### Q75: How do you prevent bot automation?

**Answer:**

```javascript
class BotProtection {
  // 1. Rate limiting per IP
  async checkIPRateLimit(ip) {
    const key = `ratelimit:ip:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 60);
    }
    return count < 30; // Max 30 requests per minute
  }
  
  // 2. Human verification (CAPTCHA)
  async verifyHuman(userId) {
    const verified = await redis.get(`human:${userId}`);
    if (verified) return true;
    
    // Generate CAPTCHA
    const captcha = this.generateCaptcha();
    await redis.setex(`captcha:${userId}`, 300, captcha.answer);
    
    return { challenge: captcha.image };
  }
  
  // 3. Behavioral analysis
  async analyzeBehavior(userId, actions) {
    const mouseMovements = actions.filter(a => a.type === 'mousemove');
    const clicks = actions.filter(a => a.type === 'click');
    
    // Bots have perfect timing
    const clickIntervals = this.getIntervals(clicks.map(c => c.timestamp));
    const hasPerfectTiming = clickIntervals.every(i => i === clickIntervals[0]);
    
    if (hasPerfectTiming) {
      return { isBot: true, reason: 'PERFECT_TIMING' };
    }
    
    // No mouse movement = likely bot
    if (mouseMovements.length < 5 && clicks.length > 10) {
      return { isBot: true, reason: 'NO_MOUSE_MOVEMENT' };
    }
    
    return { isBot: false };
  }
}
```

---

## 17. Game-Specific: Analytics & Metrics

### Q76: What metrics do you track for the game?

**Answer:**


```javascript
class GameMetrics {
  // Track bet placement
  async trackBetPlaced(bet) {
    await redis.incr('metrics:bets:total');
    await redis.incr(`metrics:bets:${bet.choice}`);
    await redis.incrby('metrics:volume:total', bet.amount);
  }
  
  // Track game round
  async trackRound(round) {
    await redis.incr('metrics:rounds:total');
    await redis.hset('metrics:round:latest', {
      id: round.id,
      players: round.playerCount,
      pool: round.totalPool
    });
  }
  
  // Get dashboard metrics
  async getDashboard() {
    const [totalBets, totalVolume, activePlayers] = await Promise.all([
      redis.get('metrics:bets:total'),
      redis.get('metrics:volume:total'),
      redis.scard('active:players')
    ]);
    
    return {
      totalBets: parseInt(totalBets || 0),
      totalVolume: parseInt(totalVolume || 0),
      activePlayers: activePlayers || 0
    };
  }
}
```

---

### Q77: How do you calculate player retention?

**Answer:**

```javascript
class RetentionService {
  async calculateRetention(startDate, endDate) {
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } }
    });
    
    const userIds = users.map(u => u.id);
    
    // Day 1 retention
    const day1 = await this.getReturningUsers(userIds, 1);
    
    // Day 7 retention
    const day7 = await this.getReturningUsers(userIds, 7);
    
    // Day 30 retention
    const day30 = await this.getReturningUsers(userIds, 30);
    
    return {
      totalUsers: userIds.length,
      day1: (day1 / userIds.length * 100).toFixed(2) + '%',
      day7: (day7 / userIds.length * 100).toFixed(2) + '%',
      day30: (day30 / userIds.length * 100).toFixed(2) + '%'
    };
  }
  
  async getReturningUsers(userIds, daysAfter) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAfter);
    
    const returning = await prisma.bet.count({
      where: {
        userId: { in: userIds },
        createdAt: { gte: targetDate }
      }
    });
    
    return returning;
  }
}
```

---

### Q78: How do you track revenue metrics?

**Answer:**

```javascript
class RevenueMetrics {
  async calculateRevenue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Total bets today
    const bets = await prisma.bet.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { amount: true }
    });
    
    // Total payouts today
    const payouts = await prisma.bet.aggregate({
      where: { 
        createdAt: { gte: today },
        result: 'WIN'
      },
      _sum: { payout: true }
    });
    
    const totalBets = bets._sum.amount || 0;
    const totalPayouts = payouts._sum.payout || 0;
    const revenue = totalBets - totalPayouts;
    
    return {
      totalBets,
      totalPayouts,
      revenue,
      houseEdge: ((revenue / totalBets) * 100).toFixed(2) + '%'
    };
  }
}
```

---

## 18. Game-Specific: Error Handling & Recovery

### Q79: How do you handle game state recovery after crash?


**Answer:**

```javascript
class GameRecovery {
  async recoverGameState() {
    // Find incomplete rounds
    const incompleteRounds = await prisma.gameRound.findMany({
      where: {
        phase: { not: 'CLOSED' },
        createdAt: { lt: new Date(Date.now() - 60000) } // Older than 1 min
      }
    });
    
    for (const round of incompleteRounds) {
      await this.settleRound(round.id);
    }
    
    return { recovered: incompleteRounds.length };
  }
  
  async settleRound(roundId) {
    const round = await prisma.gameRound.findUnique({
      where: { id: roundId }
    });
    
    if (!round.diceResult) {
      // No dice result - refund all bets
      await this.refundBets(roundId);
    } else {
      // Settle normally
      await this.settleBets(roundId, round.diceResult);
    }
    
    // Close round
    await prisma.gameRound.update({
      where: { id: roundId },
      data: { phase: 'CLOSED' }
    });
  }
  
  async refundBets(roundId) {
    const bets = await prisma.bet.findMany({
      where: { roundId }
    });
    
    for (const bet of bets) {
      await prisma.user.update({
        where: { id: bet.userId },
        data: { totalCoins: { increment: bet.amount } }
      });
    }
  }
}
```

---

### Q80: How do you handle WebSocket reconnection during game?

**Answer:**

```javascript
// Client-side reconnection
socket.on('disconnect', () => {
  console.log('Disconnected, attempting to reconnect...');
});

socket.on('reconnect', async () => {
  // Request current game state
  socket.emit('sync-state');
});

socket.on('sync-state', async () => {
  // Get current round
  const round = await api.getCurrentRound();
  
  // Get user's pending bet
  const myBet = await api.getMyBet(round.id);
  
  // Update UI
  updateGameState(round, myBet);
});

// Server-side
socket.on('sync-state', async (socket) => {
  const round = await redis.get('round:active');
  const userBet = await redis.get(`bet:${round}:${socket.userId}`);
  
  socket.emit('game-state', {
    round,
    userBet: userBet ? JSON.parse(userBet) : null
  });
});
```

---

## 19. Message Queues & Async Processing

### Q61: What is a message queue and when to use it?

**Answer:**

A message queue enables asynchronous communication between services.

**When to use:**
- Long-running tasks (bet settlement)
- Decouple services
- Handle bursts of traffic
- Ensure reliability

**Implementation with RabbitMQ:**
```javascript
const amqp = require('amqplib');

// Producer
async function publishBet(bet) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue('bets', { durable: true });
  channel.sendToQueue('bets', Buffer.from(JSON.stringify(bet)), {
    persistent: true
  });
}

// Consumer
channel.consume('bets', async (msg) => {
  const bet = JSON.parse(msg.content.toString());
  await processBet(bet);
  channel.ack(msg);
});
```

---

### Q62: What is the difference between RabbitMQ and Kafka?

**Answer:**

| Feature | RabbitMQ | Kafka |
|---------|-----------|-------|
| Architecture | Message broker | Distributed log |
| Ordering | Per queue | Per partition |
| Retention | Based on acknowledgment | Time-based |
| Use case | Real-time messaging | Event streaming |
| Performance | ~100K msg/s | ~1M msg/s |

---

### Q63: How do you implement dead letter queues?

**Answer:**

Dead letter queues handle failed messages:
```javascript
// Configure DLQ
await channel.assertQueue('bets_dlq', { durable: true });

await channel.assertQueue('bets', {
  durable: true,
  deadLetterExchange: '',
  deadLetterRoutingKey: 'bets_dlq'
});

// Process failed messages
channel.consume('bets_dlq', async (msg) => {
  const bet = JSON.parse(msg.content.toString());
  await notifyAdmin(`Failed bet: ${bet.id}`);
  await logFailedBet(bet);
  channel.ack(msg);
});
```

---

## 14. GraphQL (Alternative to REST)

### Q64: What is GraphQL and when to use it?

**Answer:**

GraphQL is a query language for APIs that allows clients to request exactly the data they need.

**When to use:**
- Multiple clients (mobile, web)
- Complex data requirements
- Reducing over-fetching

**Schema:**
```graphql
type Player {
  id: ID!
  username: String!
  balance: Int!
  bets: [Bet!]!
}

type Bet {
  id: ID!
  amount: Int!
  choice: String!
  result: String
  round: Round!
}

type Query {
  player(id: ID!): Player
  leaderboard(limit: Int): [Player!]!
}

type Mutation {
  placeBet(amount: Int!, choice: String!): Bet!
}
```

**Query:**
```graphql
query {
  player(id: "123") {
    username
    balance
    bets(limit: 5) {
      amount
      result
    }
  }
}
```

---

### Q65: What are the advantages and disadvantages of GraphQL?

**Answer:**

**Advantages:**
- Reduced over-fetching
- Single endpoint
- Strongly typed schema
- Self-documenting

**Disadvantages:**
- Complexity
- Caching challenges
- File uploads not native
- N+1 query problems

---

## 15. TypeScript

### Q66: Why use TypeScript with Node.js?

**Answer:**

TypeScript adds static typing to JavaScript.

**Benefits:**
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring

**Example:**
```typescript
interface Bet {
  id: string;
  userId: string;
  amount: number;
  choice: 'BIG' | 'SMALL';
  result?: 'WIN' | 'LOSE';
}

function calculatePayout(bet: Bet, winner: string): number {
  if (bet.result === 'WIN') {
    return bet.amount * 2;
  }
  return 0;
}
```

---

### Q67: What is the difference between type and interface?

**Answer:**

| Feature | Type | Interface |
|---------|------|----------|
| Extend | `&` (intersection) | `extends` |
| Add properties | No (creates new) | Yes |
| Declaration merging | No | Yes |
| Use case | Unions, primitives | Object shapes |

```typescript
// Interface - can be extended
interface User {
  id: string;
  name: string;
}

interface User {
  email: string; // Adding to existing
}

// Type - can use unions
type Status = 'pending' | 'success' | 'error';
type Result = Bet | Transaction;
```

---

## 16. Logging & Monitoring

### Q68: How do you implement structured logging?

**Answer:**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'dice-game' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});

// Usage
logger.info('Bet placed', {
  userId: user.id,
  amount: bet.amount,
  roundId: round.id,
  choice: bet.choice
});

logger.error('Payment failed', {
  error: err.message,
  userId: user.id,
  stack: err.stack
});
```

**Output:**
```json
{"level":"info","message":"Bet placed","timestamp":"2024-01-01T00:00:00.000Z","service":"dice-game","userId":"123","amount":100}
```

---

### Q69: What is the ELK stack?

**Answer:**

ELK (Elasticsearch, Logstash, Kibana) is a popular logging solution.

```
┌──────────┐    ┌────────────┐    ┌─────────────┐    ┌─────────┐
│  Logs    │───►│  Logstash  │───►│Elasticsearch│───►│  Kibana │
│ (Files)  │    │ (Pipeline) │    │  (Search)  │    │ (UI)   │
└──────────┘    └────────────┘    └─────────────┘    └─────────┘
```

**Setup:**
```yaml
# docker-compose.yml
elasticsearch:
  image: elasticsearch:8
kibana:
  image: kibana:8
logstash:
  image: logstash:8
```

---

### Q70: How do you set up application monitoring?

**Answer:**

**Prometheus + Grafana:**
```javascript
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path, res.statusCode).observe(duration);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

---

## 17. API Design Patterns

### Q71: What is the Repository Pattern?

**Answer:**

The Repository Pattern abstracts database operations.

```typescript
interface IBetRepository {
  findById(id: string): Promise<Bet | null>;
  findByUserId(userId: string): Promise<Bet[]>;
  create(bet: Bet): Promise<Bet>;
  update(id: string, data: Partial<Bet>): Promise<Bet>;
}

class BetRepository implements IBetRepository {
  async findById(id: string): Promise<Bet | null> {
    return await prisma.bet.findUnique({ where: { id } });
  }
  
  async findByUserId(userId: string): Promise<Bet[]> {
    return await prisma.bet.findMany({ where: { userId } });
  }
  
  async create(bet: Bet): Promise<Bet> {
    return await prisma.bet.create({ data: bet });
  }
}

class BetService {
  constructor(private betRepo: IBetRepository) {}
  
  async placeBet(userId: string, amount: number) {
    // Use repository
    const bet = await this.betRepo.create({ userId, amount });
    return bet;
  }
}
```

---

### Q72: What is the Factory Pattern?

**Answer:**

Factory pattern creates objects without specifying exact class.

```javascript
class GameFactory {
  static createGame(type: string, config: GameConfig): Game {
    switch (type) {
      case 'DICE':
        return new DiceGame(config);
      case 'SLOT':
        return new SlotGame(config);
      case 'ROULETTE':
        return new RouletteGame(config);
      default:
        throw new Error(`Unknown game type: ${type}`);
    }
  }
}

// Usage
const game = GameFactory.createGame('DICE', { rounds: 10, minBet: 50 });
game.start();
```

---

### Q73: What is the Strategy Pattern?

**Answer:**

Strategy pattern allows selecting algorithm at runtime.

```javascript
// Different payout strategies
class PayoutStrategy {
  calculate(bet, result) { throw new Error('Not implemented'); }
}

class FixedPayout extends PayoutStrategy {
  calculate(bet, result) {
    return result.winner === bet.choice ? bet.amount * 2 : 0;
  }
}

class MultiplierPayout extends PayoutStrategy {
  calculate(bet, result) {
    const multiplier = result.dice === 6 ? 3 : 2;
    return result.winner === bet.choice ? bet.amount * multiplier : 0;
  }
}

class Game {
  constructor(private payoutStrategy: PayoutStrategy) {}
  
  setPayoutStrategy(strategy: PayoutStrategy) {
    this.payoutStrategy = strategy;
  }
  
  settle(bet, result) {
    return this.payoutStrategy.calculate(bet, result);
  }
}
```

---

## 18. Design Patterns in Node.js

### Q74: What is the Singleton Pattern?

**Answer:**

Singleton ensures only one instance exists.

```javascript
// Database connection singleton
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = this.connect();
    Database.instance = this;
  }
  
  connect() {
    // Connect to database
    return new PrismaClient();
  }
}

// Usage - always returns same instance
const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true
```

---

### Q75: What is the Observer Pattern?

**Answer:**

Observer defines one-to-many dependencies.

```javascript
class GameObserver {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  
  notify(event, data) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

// Usage
const gameEvents = new GameObserver();

gameEvents.subscribe({
  update(event, data) {
    if (event === 'BET_PLACED') {
      analytics.track('bet_placed', data);
    }
  }
});

gameEvents.notify('BET_PLACED', { amount: 100 });
```

---

## 19. Advanced JavaScript

### Q76: What is the difference between == and ===?

**Answer:**

| Operator | Comparison | Type Conversion |
|----------|------------|-----------------|
| `==` | Value | Yes (coercion) |
| `===` | Value + Type | No |

```javascript
// == (loose equality) - AVOID
console.log(1 == '1');    // true
console.log(0 == false);  // true
console.log(null == undefined); // true

// === (strict equality) - PREFERRED
console.log(1 === '1');   // false
console.log(0 === false); // false
console.log(null === undefined); // false
```

---

### Q77: What is JavaScript hoisting?

**Answer:**

Hoisting moves declarations to top of scope.

```javascript
// This works due to hoisting
console.log(x); // undefined (not error)
var x = 5;

// Equivalent to:
var x;
console.log(x); // undefined
x = 5;

// let/const are also hoisted but in "temporal dead zone"
// console.log(y); // ReferenceError
let y = 10;
```

---

### Q78: What is closure in JavaScript?

**Answer:**


A closure is a function that remembers its outer variables.

```javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
// count is not accessible directly
```

---

### Q79: What is the event bubbling and capturing?

**Answer:**

Event propagation has three phases:

```
Capturing (top to bottom)    Target    Bubbling (bottom to top)
        ▼                       ▼              ▼
┌─────────────────────────────────────────────────────┐
│  Window                                            │
│    ▼                                               │
│  Document                                          │
│    ▼                                               │
│  HTML                                              │
│    ▼                                               │
│  Body                                              │
│    ▼                                               │
│  Container  ──►  Button  ◄───  (target)             │
│    ▼                                               │
│  Button                                            │
└─────────────────────────────────────────────────────┘
```

**Example:**
```javascript
// Bubbling (default)
button.addEventListener('click', () => console.log('button'));
container.addEventListener('click', () => console.log('container'));
// Clicking button logs: button, container

// Capturing
button.addEventListener('click', () => console.log('button'), true);
container.addEventListener('click', () => console.log('container'), true);
// Clicking button logs: container, button
```

---

### Q80: What is the difference between null and undefined?

**Answer:**

| Aspect | null | undefined |
|--------|------|------------|
| Type | object | undefined |
| Meaning | Intentional absence | Unintentional |
| Assignment | Can be assigned | Automatic |
| == | false | false |
| === | false | false |

```javascript
let a; // undefined (declared but not assigned)
let b = null; // null (intentional absence)

console.log(typeof a); // undefined
console.log(typeof b); // object (JS bug)

// Both are falsy
if (!a && !b) {
  console.log('both are falsy');
}
```

---

## 20. Advanced Node.js


### Q81: What is the Node.js module resolution algorithm?

**Answer:**

Node.js resolves modules in order:

```
1. Core modules (fs, path, http)
   ↓
2. File modules (./ or ../)
   ↓
3. node_modules directories
   ↓
4. Throw MODULE_NOT_FOUND
```

**Resolution algorithm:**
```javascript
// For require('fs') - Core module
// For require('./utils') - File module
// For require('lodash') - node_modules

// With package.json main field:
// node_modules/lodash/package.json -> main: index.js
```

---

### Q82: How does require() work in Node.js?

**Answer:**

```javascript
// require() steps:
// 1. Check module cache
// 2. Resolve module path
// 3. Load module (compile if JS)
// 4. Return module.exports

// Module cache
require.cache[require.resolve('./module')] = module;

// Circular dependencies
// a.js
console.log('a loading');
module.exports = { value: 'a' };
require('./b');
console.log('a loaded');

// b.js
console.log('b loading');
module.exports = { value: 'b' };
require('./a');
console.log('b loaded');

// Output:
a loading
b loading
a loaded
b loaded
```

---

### Q83: What is the difference between spawn and exec?

**Answer:**

| Method | Use Case | Returns |
|--------|----------|---------|
| `exec()` | Simple commands | Buffer (complete output) |
| `spawn()` | Streaming data | Child process |
| `execFile()` | Executables | Buffer |
| `fork()` | Node modules | Child process |

```javascript
// exec - for simple commands
const { exec } = require('child_process');
exec('ls -la', (err, stdout, stderr) => {
  console.log(stdout);
});

// spawn - for streaming
const { spawn } = require('child_process');
const child = spawn('npm', ['install']);
child.stdout.on('data', (data) => console.log(data.toString()));
child.stderr.on('data', (data) => console.error(data.toString()));
```

---

### Q84: What is process.env in Node.js?

**Answer:**

`process.env` contains environment variables.

```javascript
// Access environment variable
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;

// Set in terminal
// PORT=3000 node server.js

// In .env file (using dotenv)
require('dotenv').config();
// Now process.env has .env values
```

**Common environment variables:**
- `NODE_ENV` - development/production
- `PORT` - Server port
- `PATH` - System PATH
- `HOME` - User home directory

---

### Q85: How do you handle signals in Node.js?

**Answer:**

Process signals allow graceful shutdown.

```javascript
// Handle SIGTERM (docker stop, kill)
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    db.$disconnect();
    process.exit(0);
  });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('SIGINT received');
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
```

---

## 21. Security Advanced

### Q86: What is XSS and how to prevent it?

**Answer:**

XSS (Cross-Site Scripting) injects malicious scripts.

**Types:**
- Stored (saved in DB)
- Reflected (in URL)
- DOM-based (client-side)

**Prevention:**
```javascript
// 1. Escape output
const escapeHtml = (str) => {
  return str.replace(/[&<>"]/g, (c) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
};

// 2. Use Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"]
  }
}));

// 3. Use HTTPOnly cookies
res.cookie('token', token, { httpOnly: true });
```

---

### Q87: What is CSRF and how to prevent it?

**Answer:**

CSRF (Cross-Site Request Forgery) tricks users into making unwanted requests.

**Prevention:**
```javascript
// 1. CSRF Token
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// 2. SameSite cookies
res.cookie('session', token, {
  sameSite: 'strict'
});

// 3. Check Origin header
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});
```

---

### Q88: What is rate limiting per user?

**Answer:**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  keyGenerator: (req) => req.user.id, // Per user
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: 60
    });
  },
  skip: (req) => req.user.isAdmin // Skip for admin
});
```

---

### Q89: How do you implement input sanitization?

**Answer:**

```javascript
const sanitize = require('sanitize-html');

const clean = sanitize(userInput, {
  allowedTags: [], // No HTML tags
  allowedAttributes: {},
  allowedSchemes: []
});

// For SQL - use parameterized queries (Prisma does this)
// For NoSQL - use Mongoose sanitizers
// For commands - never use user input in exec()
```

---

### Q90: What is JWT refresh token strategy?

**Answer:**

```javascript
// Access token (short-lived)
const accessToken = jwt.sign(
  { userId },
  ACCESS_SECRET,
  { expiresIn: '15m' }
);

// Refresh token (long-lived, stored in DB)
const refreshToken = jwt.sign(
  { userId },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token
await prisma.refreshToken.create({
  data: { token: refreshToken, userId }
});

// Refresh endpoint
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  // Verify refresh token
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  
  // Check if valid in DB
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  });
  
  if (!stored) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  
  // Generate new access token
  const newAccessToken = jwt.sign(
    { userId: decoded.userId },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  res.json({ accessToken: newAccessToken });
});
```

---

## 22. Data Structures & Algorithms

### Q91: What is Big O notation?

**Answer:**

Big O describes algorithm complexity.

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array index access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Loop through array |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Nested loops |
| O(2^n) | Exponential | Recursive Fibonacci |

**Examples:**
```javascript
// O(1)
arr[0];

// O(n)
for (let i = 0; i < n; i++) {}

// O(n²)
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {}
}

// O(log n)
while (low <= high) {
  mid = (low + high) / 2;
}
```

---

### Q92: What is a hash table?

**Answer:**

Hash tables store key-value pairs with O(1) lookup.

```javascript
// JavaScript Map (hash table)
const playerBalances = new Map();

playerBalances.set('player1', 1000);
playerBalances.set('player2', 500);

console.log(playerBalances.get('player1')); // O(1) - 1000
console.log(playerBalances.has('player3')); // O(1) - false

// Redis Hash
await client.hset('player:1', 'balance', '1000');
await client.hget('player:1', 'balance'); // O(1)
```

---

### Q93: What is a linked list?

**Answer:**

Linked lists store elements with pointers.

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  add(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
}
```

**vs Array:**
- Insert: O(1) vs O(n)
- Access: O(n) vs O(1)
- Memory: More (pointers) vs Less

---

### Q94: What is a binary tree?

**Answer:**

Binary trees have at most 2 children per node.

```
        root
       /    \
     left   right
    /  \    /  \
   L   R  L   R
```

**Binary Search Tree:**
```javascript
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
  
  insert(value) {
    if (value < this.value) {
      if (!this.left) this.left = new BSTNode(value);
      else this.left.insert(value);
    } else {
      if (!this.right) this.right = new BSTNode(value);
      else this.right.insert(value);
    }
  }
}
```

**Operations:**
- Search: O(log n) average
- Insert: O(log n) average
- Traversal: O(n)

---

### Q95: What is a priority queue?

**Answer:**

Priority queue serves elements by priority, not FIFO.

```javascript
// Using Redis Sorted Set as priority queue
// Higher score = higher priority

// Add to queue (priority = amount)
await client.zadd('bet_queue', betAmount, betId);

// Get highest priority
const nextBet = await client.zpopmax('bet_queue');

// Get all in priority order
const allBets = await client.zrevrange('bet_queue', 0, -1);
```

---

## 23. Advanced Database


### Q96: What is database sharding?

**Answer:**

Sharding splits data across databases.

```
┌─────────────┐
│  App Server  │
└──────┬──────┘
       │
┌──────▼──────┐
│ Shard Router│
└──────┬──────┘
       │
  ┌────┼────┐
  ▼    ▼    ▼
┌───┐ ┌───┐ ┌───┐
│ S1│ │ S2│ │ S3│
│ A-I│ │J-R│ │S-Z│
└───┘ └───┘ └─────┘
```

**Sharding by user ID:**
```javascript
function getShard(userId) {
  const shardNum = parseInt(userId) % 4;
  return `shard_${shardNum}`;
}

const shard = getShard('123');
const db = databases[shard];
```

---

### Q97: What is database replication?

**Answer:**

Replication copies data to multiple databases.

```
Primary DB ──────► Replica 1
    │                  │
    └──────────────► Replica 2
```

**Types:**
- **Synchronous** - All replicas must confirm
- **Asynchronous** - Primary commits, replicas async

**PostgreSQL Setup:**
```sql
-- On replica
CREATE PUBLICATION mypub FOR ALL TABLES;

-- On primary
CREATE SUBSCRIPTION mysub 
CONNECTION 'host=replica1 dbname=mydb' 
PUBLICATION mypub;
```

---

### Q98: What is eventual consistency?

**Answer:**

Eventual consistency guarantees data will be consistent eventually.

```
Immediate (Strong)          Eventual
┌─────────────┐            ┌─────────────┐
│ Write to DB │            │ Write to DB │
│      │      │            │      │      │
│      ▼      │            │      ▼      │
│ Return OK   │            │ Return OK   │
│      │      │            │      │      │
│      ▼      │            │      ▼      │
│ Replicate   │            │ Replicate  │
│      │      │            │ (async)    │
│      ▼      │            │      │      │
│ All replicas│            │ Some replicas│
│ updated    │            │ may lag     │
└─────────────┘            └─────────────┘
```

**Use case:** Redis cache, leaderboards

---

### Q99: What is the difference between SQL and NoSQL?

**Answer:**

| Aspect | SQL (PostgreSQL) | NoSQL (MongoDB) |
|--------|------------------|-----------------|
| Schema | Fixed | Flexible |
| Queries | Complex joins | Simple |
| Transactions | ACID | Eventually consistent |
| Scaling | Vertical | Horizontal |
| Use case | Financial data | Logs, cache |

**SQL Example:**
```sql
SELECT u.username, SUM(b.amount) as total
FROM users u
JOIN bets b ON u.id = b.user_id
GROUP BY u.id
ORDER BY total DESC
LIMIT 10;
```

**NoSQL Example:**
```javascript
db.users.aggregate([
  { $lookup: { from: 'bets', localField: 'id', foreignField: 'userId', as: 'bets' } },
  { $project: { username: 1, total: { $sum: '$bets.amount' } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

---

### Q100: What is database connection pooling?

**Answer:**

Connection pooling reuses database connections.

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query uses available connection
const result = await pool.query('SELECT * FROM users');

// Check pool status
console.log(pool.totalCount);    // Total created
console.log(pool.idleCount);     // Available
console.log(pool.busyCount);     // In use

// Don't forget to close
pool.end();
```

**Benefits:**
- Reduces connection overhead
- Prevents connection exhaustion
- Improves performance

---

---

*Document Version: 2.0*
*Last Updated: 2026-04-21*
