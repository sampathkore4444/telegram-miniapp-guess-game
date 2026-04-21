I've created complete folder structures for both backend and frontend:

## 📁 Backend Structure (Node.js + Express + Socket.io)

```
backend/
├── package.json
├── prisma/
│   └── schema.prisma
└── src/
    ├── index.js                    # Entry point
    ├── core/
    │   ├── config/index.js       # Configuration
    │   └── constants/index.js   # Game constants
    ├── common/
    │   ├── interfaces/index.js # Type definitions
    │   └── events/index.js     # WebSocket events
    ├── database/
    │   ├── prisma/index.js    # PostgreSQL client
    │   └── redis/index.js   # Redis client
    ├── middleware/
    │   ├── auth.middleware.js
    │   └── error.middleware.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── game.routes.js
    │   ├── player.routes.js
    │   └── leaderboard.routes.js
    ├── services/
    │   ├── game/game.service.js       # Core game logic
    │   ├── wallet/wallet.service.js # Balance management
    │   └── leaderboard/leaderboard.service.js
    └── websocket/
        └── index.js                # WebSocket handlers
```

**Business Logic in Services:**
- [`game.service.js`](backend/src/services/game/game.service.js:1) - Round management, betting, dice rolling, settlement
- [`wallet.service.js`](backend/src/services/wallet/wallet.service.js:1) - Balance updates, transactions
- [`leaderboard.service.js`](backend/src/services/leaderboard/leaderboard.service.js:1) - Rankings

## 📁 Frontend Structure (React + Vite + Tailwind)

```
frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── index.jsx
    ├── App.jsx
    ├── components/
    │   ├── ui/
    │   │   ├── Button.jsx      # Reusable button
    │   │   ├── Card.jsx      # Reusable card
    │   │   └── Badge.jsx    # Reusable badge
    │   └── game/
    │       ├── DiceArea.jsx      # Animated dice display
    │       ├── ChoiceButtons.jsx # BIG/SMALL buttons
    │       └── BetSelector.jsx # Bet amount selector
    ├── context/
    │   ├── GameContext.jsx   # Game state (Zustand)
    │   └── AuthContext.jsx    # Auth state (Zustand)
    ├── hooks/
    │   ├── useGame.js
    │   └── useAuth.js
    ├── services/
    │   ├── api.service.js    # REST API client
    │   └── socket.service.js # WebSocket client
    ├── pages/
    │   ├── GamePage.jsx
    │   └── LoadingPage.jsx
    └── styles/
        └── globals.css
```

**Reusable Components:**
- [`Button.jsx`](frontend/src/components/ui/Button.jsx:1) - Multiple variants (primary, secondary, danger, big, small)
- [`Card.jsx`](frontend/src/components/ui/Card.jsx:1) - Multiple variants (default, highlight, glass)
- [`Badge.jsx`](frontend/src/components/ui/Badge.jsx:1) - Multiple variants (success, warning, error, gold)
- [`DiceArea.jsx`](frontend/src/components/game/DiceArea.jsx:1) - Animated dice with rotation
- [`ChoiceButtons.jsx`](frontend/src/components/game/ChoiceButtons.jsx:1) - BIG/SMALL game buttons
- [`BetSelector.jsx`](frontend/src/components/game/BetSelector.jsx:1) - Bet amount selector

Both projects use modular architecture with clear separation of concerns. Run `npm install` in each folder to set up dependencies.




okay got it. but why models folder in the backend is empty......the prisma models should be there here....like 1 model in one file each right

✅ I've created 4 model files in the backend models folder (1 model per file):

```
backend/src/models/
├── index.js          # Exports all models
├── User.js          # User model (CRUD operations)
├── GameRound.js      # GameRound model
├── Bet.js           # Bet model
└── Transaction.js   # Transaction model
```

**Each model includes:**
- `create()` - Create new record
- `findById()` - Find by ID
- `findBy[Field]()` - Find by various fields
- `update()` - Update record
- `delete()` - Delete record
- Additional useful methods

Example from [`User.js`](backend/src/models/User.js:1):
```javascript
static async create(data) { ... }
static async findByTelegramId(telegramId) { ... }
static async findById(id) { ... }
static async updateCoins(id, coins) { ... }
static async getTopUsers(limit) { ... }
```

The models use Prisma under the hood but expose a clean API. You can use these models in your services instead of raw Prisma calls.


why schemas folder is empty.....as per me, it should have request and response for each service or so right?

✅ I've created schema files for request/response validation:

```
backend/src/schemas/
├── index.js              # Exports all schemas
├── auth.schema.js        # Auth schemas (login, verify)
├── game.schema.js        # Game schemas (placeBet, gameState)
├── player.schema.js      # Player schemas (profile, wallet)
└── leaderboard.schema.js # Leaderboard schemas
```

**Schema files include:**

| File | Schemas |
|------|---------|
| [`auth.schema.js`](backend/src/schemas/auth.schema.js:1) | `telegramLoginRequest`, `authResponse` |
| [`game.schema.js`](backend/src/schemas/game.schema.js:1) | `placeBetRequest`, `gameStateResponse`, `betSettlementResponse` |
| [`player.schema.js`](backend/src/schemas/player.schema.js:1) | `profileResponse`, `walletResponse` |
| [`leaderboard.schema.js`](backend/src/schemas/leaderboard.schema.js:1) | `leaderboardEntry`, `globalLeaderboardResponse` |

**Validation middleware created:**
- [`validate.middleware.js`](backend/src/middleware/validate.middleware.js:1) - `validateBody()`, `validateQuery()`, `validateParams()`

**Usage in routes:**
```javascript
const { validateBody } = require('./middleware/validate.middleware');
const { placeBetRequest } = require('./schemas/game.schema');

router.post('/place-bet', 
  authMiddleware, 
  validateBody(placeBetRequest), 
  gameController.placeBet
);
```

Each schema uses Zod for type-safe validation with clear error messages.