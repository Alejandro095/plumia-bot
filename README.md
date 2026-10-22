# PlumIA · Backend & Conversational Assistant

**REST API and chatbot that connect smart parking gates with drivers in real time.**

`plumia-bot` is the backend of **PlumIA**, a smart parking gate system for shopping malls developed as my capstone graduation project for an engineering degree. It is the central service of the platform: it receives the license plates recognized by the gates, manages visits and parking spot allocation, calculates the cost of each stay and communicates with drivers through a conversational assistant.

PlumIA replaces the traditional paper ticket with a fully contactless experience. When a vehicle arrives, the driver automatically receives a personalized welcome, the hourly rate and the exact location of their assigned spot on a map. On departure, the assistant sends a breakdown of the duration and total cost of the stay. The assistant runs on Telegram, and its messaging layer is designed to support additional channels such as WhatsApp.

## Highlights

- **Ticketless parking.** Vehicles are identified by their license plate, so drivers never need to take or pay a paper ticket.
- **Automatic spot allocation.** Each incoming vehicle is assigned an available parking spot, and the occupancy of every mall is updated in real time.
- **Location sharing.** The assistant sends the GPS location of the assigned spot as a map pin, so drivers can go straight to it.
- **Automatic billing.** The duration of each visit is tracked from entry to exit, and the total cost is calculated from the mall's hourly rate.
- **Conversational onboarding.** New drivers sign up directly in the chat by providing their car model and license plate, with no forms or extra apps.
- **Self-service assistant.** Registered drivers can check their elapsed time, consult the parking rate and update their license plate at any time.
- **Production-ready architecture.** Layered design, request validation, environment-based configuration and webhook delivery in production.

## System architecture

PlumIA is built as a distributed system made up of three components:

| Repository | Layer | Responsibility |
| --- | --- | --- |
| [plumia-rasp](https://github.com/Alejandro095/plumia-rasp) | Edge device | Raspberry Pi at the gate. License plate recognition with computer vision, barrier control, sensors and OLED display. |
| [plumia-bot](https://github.com/Alejandro095/plumia-bot) | Backend | REST API and conversational assistant (this repository). Manages users, vehicles, visits and parking spots, and notifies drivers in real time. |
| [plumia-admin](https://github.com/Alejandro095/plumia-admin) | Management | Web dashboard for mall administrators. Manages parking spots, rates and the visitor log. |

```
┌──────────────────────┐   license plate   ┌──────────────────────┐   notifications   ┌──────────────┐
│     Edge device      │ ────────────────▶ │      plumia-bot      │ ────────────────▶ │    Driver    │
│    (Raspberry Pi)    │                   │  REST API + chatbot  │ ◀──────────────── │  (Telegram)  │
│  ALPR · servo ·      │ ◀──────────────── │                      │     messages      └──────────────┘
│  sensors · OLED      │  visit / spots    └──────────┬───────────┘
└──────────────────────┘                              │
                                                      ▼
                                           ┌──────────────────────┐                   ┌──────────────┐
                                           │      PostgreSQL      │ ◀──────────────── │ plumia-admin │
                                           │       database       │                   │   (Astro)    │
                                           └──────────────────────┘                   └──────────────┘
```

## Visit lifecycle

**Arrival**

1. The gate recognizes the license plate and sends it to `POST /api/visit/arrived`.
2. The backend verifies that the vehicle belongs to a registered driver and that it has no visit in progress.
3. An available spot in the mall is assigned and marked as occupied.
4. A new visit is created with its entry timestamp.
5. The driver receives a welcome message with the mall name, the hourly rate and the location of their spot.
6. The gate receives a confirmation and opens the barrier.

If the vehicle is not registered, the API responds accordingly and the gate displays a QR code that takes the driver to the assistant to sign up.

**Departure**

1. The license plate is sent to `POST /api/visit/departed`.
2. The active visit is closed with its exit timestamp and the spot is released.
3. The cost of the stay is calculated from the duration and the mall's hourly rate.
4. The driver receives a summary with the duration, the rate and the total cost.

## Conversational assistant

The assistant guides each driver through a stateful conversation flow:

| Flow | Description |
| --- | --- |
| Onboarding | First-time users are greeted and asked for their car model and license plate. The account and vehicle are created automatically. |
| Elapsed time | Shows how long the driver has been parked in the current visit. |
| Parking rate | Shows the hourly rate of the mall where the driver is parked. |
| Update license plate | Lets the driver change the license plate associated with their vehicle. |
| Arrival notification | Welcome message, hourly rate and spot location sent as a map pin. |
| Departure notification | Duration of the stay, hourly rate and total cost. |

Options are presented through a custom reply keyboard, and license plates are validated against the Mexican plate formats before being stored:

```
ABC-123-A
ABC-12-34
```

## REST API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/visit/arrived` | Registers a vehicle's arrival, assigns a spot and notifies the driver. |
| `POST` | `/api/visit/departed` | Closes the active visit, releases the spot and sends the cost summary. |
| `GET` | `/api/spots/available?mallId={id}` | Returns the parking availability of a mall. |

All request bodies and query parameters are validated with Joi. Invalid requests receive a `400` response with a descriptive error.

### Examples

Register an arrival:

```http
POST /api/visit/arrived
Content-Type: application/json

{
  "licensePlate": "ABC-123-A",
  "mallId": "1"
}
```

```json
{
  "error": false,
  "message": "Visit created successfully"
}
```

Check availability:

```http
GET /api/spots/available?mallId=1
```

```json
{
  "mall": "Plaza Centrika",
  "available": true,
  "free": 3,
  "total": 4
}
```

## Data model

```
Roles ──┬──< Admins ──< Malls ──< Spots ──┐
        │                                 │
        └──< Users ──< Vehicles ──< Visits >┘
```

| Table | Description |
| --- | --- |
| `Roles` | Access roles (`ADMIN`, `USER`). |
| `Admins` | Mall administrators who use the management dashboard. |
| `Users` | Drivers, linked to their Telegram account. |
| `Vehicles` | Vehicles registered by each driver, identified by license plate. |
| `Malls` | Shopping malls and their hourly parking rate. |
| `Spots` | Parking spots of each mall, with GPS coordinates and availability. |
| `Visits` | Parking sessions, with entry and exit timestamps. |

## Tech stack

**Backend (this repository)**
- Node.js + TypeScript
- [Express](https://expressjs.com/) – REST API
- [Telegraf](https://telegraf.js.org/) – Telegram bot framework
- [Vercel Postgres](https://vercel.com/storage/postgres) – serverless PostgreSQL database
- [Joi](https://joi.dev/) + express-joi-validation – request validation
- Render – deployment

**Edge device**
- Python on Raspberry Pi
- YOLOv8 – license plate detection
- OpenCV – digital image processing
- EasyOCR – character recognition
- gpiozero + luma.oled – barrier, sensors and display

**Management dashboard**
- Astro + TypeScript
- Tailwind CSS + Flowbite
- JWT and bcrypt authentication
- Zod – schema validation

## Project structure

The code follows a layered architecture that separates HTTP handling, business logic and data access:

```
src/
├── index.ts            # Server bootstrap, bot setup and routes
├── handlers/           # HTTP and bot event handlers
├── controllers/        # Business logic: visits, spots, users and notifications
├── repositories/       # Data access with parameterized SQL queries
├── validators/         # Joi schemas and validation middleware
├── types/              # Domain types
├── utils/              # Helpers (time calculations)
└── scripts/            # Database creation and seeding
```

## Getting started

Requirements: Node.js, a PostgreSQL database (Vercel Postgres) and a Telegram bot token from [@BotFather](https://t.me/BotFather).

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/Alejandro095/plumia-bot.git
   cd plumia-bot
   npm install
   ```

2. Create a `.env` file in the root of the project:

   ```env
   BOT_TOKEN=your-telegram-bot-token
   WEBHOOK_DOMAIN=https://your-domain.com
   PORT=3000
   ENVIROMENT=development
   POSTGRES_URL=postgres://user:password@host:5432/database
   ```

   In `development` mode the bot uses long polling. In any other environment it registers a webhook on `WEBHOOK_DOMAIN`.

3. Create the database schema and load sample data:

   ```bash
   npm run db:create
   npm run db:populate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build and run for production:

   ```bash
   npm run build
   npm start
   ```

## Author

**Javier Alejandro Monsivais Tovar**
