# Building a Production-Grade URL Shortener in Node.js — The Right Way

> *This isn't a tutorial. It's a walkthrough of a real backend project — the decisions made, the architecture chosen, and why every piece of the stack earns its place.*

---

## The Idea

URL shorteners look deceptively simple on the surface. You paste a long URL, get a short one back, and when someone visits the short link they get redirected. That's it, right?

Not quite.

Once you start thinking about it seriously — authentication, ownership, security, data integrity, scalability — it becomes a genuinely interesting backend problem. This project is my take on building it **cleanly**, with a proper layered architecture, type-safe validation, JWT-based auth, and a Dockerized PostgreSQL database managed through Drizzle ORM.

Let's break it all down.

---

## Tech Stack at a Glance

| Layer | Technology | Why |
|---|---|---|
| **Runtime** | Node.js (ESM) | Native ES modules, modern JS |
| **Framework** | Express 5 | Latest stable, async error handling built-in |
| **Database** | PostgreSQL 17 (Docker) | Relational, reliable, battle-tested |
| **ORM** | Drizzle ORM | Type-safe, SQL-first, zero magic |
| **Validation** | Zod 4 | Schema-first, composable, runtime-safe |
| **Auth** | JWT (jsonwebtoken) | Stateless, scalable |
| **ID Generation** | nanoid | URL-safe, compact, collision-resistant |
| **Password Hashing** | Node `crypto` (HMAC-SHA256 + salt) | No external dependency, secure |
| **Package Manager** | pnpm | Fast, disk-efficient |

No unnecessary dependencies. Every package has a job.

---

## Project Structure

```
project-url-shortener/
├── index.js                  ← App entry point
├── docker-compose.yml        ← PostgreSQL container
├── drizzle.config.js         ← ORM config
│
├── models/                   ← Database schema (Drizzle tables)
│   ├── user.model.js
│   ├── url.model.js
│   └── index.js              ← Barrel export
│
├── services/                 ← Database interaction layer
│   ├── user.service.js
│   └── url.service.js
│
├── controller/               ← Request/response handling
│   ├── auth.controller.js
│   └── url.controller.js
│
├── routes/                   ← Route definitions
│   ├── user.route.js
│   └── url.route.js
│
├── middlewares/              ← Cross-cutting concerns
│   └── auth.middleware.js
│
├── validations/              ← Zod schemas
│   ├── request.validation.js
│   └── token.validation.js
│
└── utils/                    ← Pure utility functions
    ├── hash.js
    └── token.js
```

This is a **layered architecture**. Each folder has one clear responsibility. Nothing bleeds into anything else.

---

## The Architecture — How Data Flows

```
HTTP Request
     │
     ▼
[ Middleware ]        ← authenticationMiddleware (global, soft auth)
     │
     ▼
[ Router ]            ← url.route.js / user.route.js
     │
     ▼
[ ensureAuthenticated ]  ← Guard middleware (hard auth check)
     │
     ▼
[ Controller ]        ← Validate input → call service → send response
     │
     ▼
[ Service ]           ← All DB queries live here
     │
     ▼
[ Drizzle ORM ]       ← Type-safe SQL builder
     │
     ▼
[ PostgreSQL ]        ← Running in Docker
```

Clean, predictable, and easy to debug. If something breaks, you know exactly which layer to look at.

---

## The Database Schema

Two tables. That's all this needs.

### `users` Table

```js
export const usersTable = pgTable('users', {
  id:        uuid().primaryKey().defaultRandom(),
  firstname: varchar('first_name', { length: 55 }).notNull(),
  lastname:  varchar('last_name',  { length: 55 }),
  email:     varchar({ length: 255 }).notNull().unique(),
  password:  text().notNull(),
  salt:      text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})
```

### `urls` Table

```js
export const urlsTable = pgTable('urls', {
  id:        uuid().primaryKey().defaultRandom(),
  shortCode: varchar('code', { length: 155 }).notNull(),
  targetURL: text('target_url').notNull(),
  userId:    uuid('user_id').references(() => usersTable.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})
```

A few things worth noting:

- **UUIDs as primary keys** — no sequential integer IDs leaking information about how many records exist.
- **`userId` as a foreign key** — every short URL is owned by a user. This is what enables ownership-based deletion.
- **`updatedAt` with `$onUpdate`** — Drizzle handles this automatically. No manual timestamp management.
- **Barrel export in `models/index.js`** — both tables exported from one place, keeping imports clean across the codebase.

---

## Authentication — Two Middlewares, One Smart Design

This is one of the more interesting design decisions in the project. There are **two separate auth middlewares**, and they serve different purposes.

### `authenticationMiddleware` — Soft Auth (Global)

```js
export const authenticationMiddleware = async (req, res, next) => {
  const authHeaders = req.headers['authorization']

  if (!authHeaders) return next()  // ← No token? Fine, keep going,some routes are publis too , they don't need authentication

  if (!authHeaders.startsWith('Bearer'))
    return res.status(400).json({ error: 'Token must start with Bearer' })

  const [_, token] = authHeaders.split(' ')
  const payload = validateUserToken(token)
  req.user = payload
  next()
}
```

This runs on **every request**. But it doesn't block anything. If there's no token, it just moves on. If there is a token, it validates it and attaches the user to `req.user`.

### `ensureAuthenticated` — Hard Auth (Route-Level Guard)

```js
export const ensureAuthenticated = async (req, res, next) => {
  if (!req.user || !req.user.id)
    return res.status(400).json({ error: 'You must be logged in first' })
  next()
}
```

This is the actual gate. It's applied **per-route**, only where authentication is required. The redirect route (`/:shortCode`) is intentionally **public** — anyone with the short link should be able to use it.

```js
router.post('/shorten',  ensureAuthenticated, shorten)   // ← Protected
router.get('/allCodes',  ensureAuthenticated, codes)     // ← Protected
router.delete('/:id',    ensureAuthenticated, deleteCodes) // ← Protected
router.get('/:shortCode', shortCode)                     // ← Public
```

This separation keeps the code clean and the logic explicit.

---

## Password Security — No bcrypt, No Problem

Instead of reaching for bcrypt, this project uses Node's built-in `crypto` module with HMAC-SHA256 and a random salt.

```js
import { randomBytes, createHmac } from 'crypto'

export const hashPasswordWithSalt = (password, userSalt = undefined) => {
  const salt = userSalt ?? randomBytes(256).toString('hex')
  const hashedpassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex')

  return { salt, password: hashedpassword }
}
```

The same function handles both **hashing a new password** (generates a fresh salt) and **verifying an existing one** (accepts the stored salt). One function, two use cases, zero duplication.

---

## Validation with Zod — Schema-First, Always

Every incoming request body is validated before it touches any business logic.

```js
export const signupPostRequestBodySchema = z.object({
  firstname: z.string(),
  lastname:  z.string().optional(),
  email:     z.email(),
  password:  z.string().min(3),
})

export const shortenPostRequestBodySchema = z.object({
  url:  z.string().url(),
  code: z.string().optional(),  // ← Custom short code is optional
})
```

And in the controller, it's always `safeParseAsync` — never `parse` — so validation errors are handled gracefully without throwing:

```js
const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body)
if (validationResult.error) {
  return res.status(400).json({ error: validationResult.error.message })
}
const { firstname, lastname, email, password } = validationResult.data
```

No raw `req.body` access anywhere in the controllers. The data is always validated and typed before use.

---

## The URL Shortening Logic

The core of the project is surprisingly clean:

```js
const shorten = async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body)
  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error.message })

  const { url, code } = validationResult.data
  const shortcode = code ?? nanoid(6)   // ← Custom code or auto-generated
  const userID = req.user.id

  const result = await createURL(url, shortcode, userID)
  return res.status(200).json({ result })
}
```

Users can bring their own short code or let `nanoid(6)` generate a 6-character URL-safe ID. nanoid is cryptographically random and has an astronomically low collision probability at this scale.

---

## The Security Detail Everyone Misses

Look at the delete service carefully:

```js
// ❌ Naive version — any authenticated user can delete anyone's URL
await db.delete(urlsTable).where(eq(urlsTable.id, id))

// ✅ Correct version — only the owner can delete their own URL
const result = await db.delete(urlsTable)
  .where(and(
    eq(urlsTable.id, id),
    eq(urlsTable.userId, userId)   // ← Ownership check at DB level
  ))
  .returning({ targetURL: urlsTable.targetURL })
```

The ownership check happens **at the database query level**, not in application code. This is the right place for it — it's atomic, it can't be bypassed, and it means even if there's a bug upstream, the database enforces the constraint.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/users/signup` | ❌ Public | Register a new user |
| `POST` | `/users/login` | ❌ Public | Login, receive JWT |
| `POST` | `/shorten` | ✅ Required | Create a short URL |
| `GET` | `/allCodes` | ✅ Required | List all your short URLs |
| `DELETE` | `/:id` | ✅ Required | Delete a short URL (owner only) |
| `GET` | `/:shortCode` | ❌ Public | Redirect to original URL |

---

## Infrastructure — Docker for Local Dev

```yaml
services:
  db:
    image: postgres:17.4
    restart: always
    ports:
      - "5430:5432"   # ← Non-default port avoids conflicts
    environment:
      POSTGRES_DB: url_shortener
    volumes:
      - db_data:/var/lib/postgresql/data  # ← Data persists across restarts
```

One command spins up the database. No local PostgreSQL installation needed. The volume mount means your data survives container restarts.

Drizzle Kit handles schema migrations:

```bash
pnpm db:push     # Push schema changes to DB
pnpm db:studio   # Open Drizzle Studio (visual DB explorer)
```

---

## What Makes This Code "Senior-Level"

Let me be direct about the decisions that separate this from a typical beginner project:

| Decision | What a beginner does | What this project does |
|---|---|---|
| **Validation** | `if (!req.body.email)` checks | Zod schemas, `safeParseAsync`, structured errors |
| **Auth** | Single middleware that blocks everything | Two-layer: soft global + hard per-route |
| **Password** | Store plaintext or use bcrypt blindly | HMAC-SHA256 with per-user salt, zero deps |
| **DB queries** | Raw SQL strings or Mongoose magic | Drizzle — type-safe, SQL-first, explicit |
| **Ownership** | Check in app code | Enforced at DB query level with `and()` |
| **Short codes** | Random math | nanoid — URL-safe, cryptographically random |
| **Architecture** | Everything in one file | Layered: routes → controllers → services → models |
| **Barrel exports** | Import from individual files everywhere | `models/index.js` — one import point |

---

## Wrapping Up

This project is small in scope but dense in good decisions. Every layer has a clear job. Validation happens before business logic. Auth is split into two concerns. Security is enforced at the right level. The database schema is clean and relational.

It's the kind of codebase where you can onboard someone new, point them to any file, and they'll immediately understand what it does and why it's there.

That's the goal. Not just code that works — code that *communicates*.

---

*Stack: Node.js · Express 5 · PostgreSQL 17 · Drizzle ORM · Zod 4 · JWT · nanoid · Docker · pnpm*
