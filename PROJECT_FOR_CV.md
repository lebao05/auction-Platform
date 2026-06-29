# Auction Platform — Project Overview

**Auction Platform** is a full-stack online auction marketplace that enables users to list products, place bids (manual and automated), purchase instantly via Buy Now, and manage multi-phase orders. The system features real-time bidding updates and in-app messaging.

---

## 1. Project Type

- **Role:** Full-Stack Developer (Solo Project)
- **Category:** Web Application — Online Auction Marketplace
- **Timeline:** 2024 – Present

---

## 2. Tech Stack

### Backend

| Category | Technology |
|---|---|
| Framework | ASP.NET Core 9 |
| Architecture | Clean Architecture + CQRS |
| ORM | Entity Framework Core 9 (SQL Server) |
| Messaging | MediatR 13 (command/query handlers) |
| Validation | FluentValidation |
| Auth | JWT Bearer tokens |
| Real-time | SignalR |
| File Storage | Azure Blob Storage |
| Email | MailKit |
| Logging | Serilog (Console + File sinks) |
| API Docs | Swagger (Swashbuckle) |

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19.1 + Vite 7 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 |
| State | TanStack Query 5 + React Context |
| Real-time | @microsoft/signalr-client |
| HTTP | Axios |
| Icons | Lucide React |
| Rich Text | React Quill |
| Toasts | Sonner + react-toastify |
| Captcha | react-google-recaptcha-v2 |

---

## 3. Architecture

### Clean Architecture (4 Layers)

```
Domain          → Entities, Enums, Domain Events, Repository Interfaces
Application     → CQRS Commands & Queries, MediatR Handlers
Infrastructure  → EF Core, Repositories, External Services (Azure, Email)
Presentation    → API Controllers, SignalR Hubs, DTOs
Web             → Entry Point, DI Setup, Middleware
Client          → React SPA
```

Each layer only depends on the layer below it. The **Domain** layer has zero external dependencies.

### CQRS + MediatR

Every operation is either a **Command** or a **Query**, dispatched through MediatR:

- **Commands:** `CreateProduct`, `PlaceBid`, `AddToWatchlist`, `Login`, `Register`, etc.
- **Queries:** `GetProductDetails`, `SearchProducts`, `GetConversations`, `GetOrder`, etc.
- **Pipeline Behaviors:** `ValidationPipelineBehavior` (FluentValidation) applied globally

### Domain-Driven Design

- **Aggregates:** `Product`, `AppUser`, `Conversation`
- **Domain Events:** `BidPlacedSuccessfullyDomainEvent`, `ProductEndedDomainEvent`, `SellerAddedDescriptionDomainEvent` — fired from entities and handled via an **Outbox Pattern** for reliable async delivery
- **Value Objects:** `Result<T>`, `Error`, `PagedResult<T>`
- **Entity base class** with `CreatedAt`, `UpdatedAt` audit fields

### Outbox Pattern

Domain events are persisted to an `OutboxMessages` table on write, then published asynchronously by a `OutboxProcessor` background service. This decouples event handling and guarantees delivery even under partial failures.

---

## 4. Key Features

### Product Auctions
- Create listings with images, start price, step price, optional Buy Now price, and auction duration
- Automatic expiration via a background service (`ProductExpirationBackgroundService`)
- Category-based browsing and full-text search with sort filters (ending soon, highest value, most bid)

### Bidding System
- Manual bidding with real-time price updates via SignalR
- Automated bidding: set a maximum bid amount; the system outbids competitors incrementally up to that ceiling
- Bid count tracking per product

### Buy Now
- Instant purchase at the seller's set price; immediately ends the auction

### User & Auth
- JWT-based authentication (1-hour token expiry)
- User registration with Google reCAPTCHA protection
- Password reset via 6-digit time-limited OTP
- Role-based access: **Bidder**, **Seller**, **User**, **Admin**
- Seller request workflow — users must request and be approved before listing

### Order Management
- Multi-phase order flow: `WaitingForPayment` → `Paid` → `Shipped` → `Completed`
- Shipping address collection per order
- Invoice URL tracking

### Real-time Chat
- SignalR `ChatHub` with group-based conversation rooms (one conversation per product between buyer and seller)
- Online/offline presence tracking
- Message read status

### Watchlist & Blacklist
- Users can save products to a watchlist
- Sellers can blacklist specific bidders from their listings

### Ratings & Reviews
- Bidding users can rate sellers after a won auction
- Average seller rating displayed on product pages

### Admin Panel
- Ban/unban users
- Manage categories and system settings
- Oversee all products

---

## 5. Infrastructure & Integrations

| Service | Purpose |
|---|---|
| SQL Server | Primary database |
| Azure Blob Storage | Product image uploads |
| MailKit (SMTP) | Transactional emails (bid notifications, password reset, auction ended) |
| Google reCAPTCHA v2 | Bot protection on registration |
| Serilog | Structured logging with daily rolling file logs |
| Swagger | API documentation at `/swagger` |

---

## 6. Database Schema (Key Entities)

- `AppUser` — extends `IdentityUser<Guid>` with profile fields
- `Product` — auction listing with pricing, dates, image URLs
- `BiddingHistory` — every bid placed with amount, timestamp, bidder
- `AutomatedBidding` — user's max-bid configuration per product
- `Conversation`, `Message`, `ConversationParticipant` — chat
- `Watchlist`, `Blacklist` — product-user relationships
- `Rating` — seller ratings from buyers
- `Comment` — product Q&A threads
- `SellerRequest` — seller approval workflow
- `SystemSetting` — configurable app parameters (e.g., `NewProductTime`)
- `OutboxMessage` — outbox pattern queue
- `Order` — multi-phase order tracking

---

## 7. Notable Technical Decisions

- **Clean Architecture with explicit layer boundaries** — enforced via project references; no cross-layer imports
- **CQRS via MediatR** — all business logic goes through commands/queries; no direct repository calls from controllers
- **Outbox Pattern** — domain events are never lost even if the email handler fails
- **Global query filters** — soft-delete filtering applied at the EF Core level
- **SignalR for all real-time needs** — bidding updates, chat messages, presence
- **Automated bidding engine** — handles all competitive bidding scenarios (outbid, counter-bid, Buy Now trigger)
- **Azure Blob abstraction** — `IFileStorageService` interface allows swapping storage providers

---

## 8. What I Worked On

- Designed and implemented the full Clean Architecture structure from scratch
- Built the CQRS layer (40+ commands and queries) with MediatR and FluentValidation
- Implemented the automated bidding engine with all edge-case handling
- Set up SignalR hubs for real-time bidding and chat
- Configured the Outbox Pattern for reliable domain event delivery
- Integrated Azure Blob Storage for product image uploads
- Built the admin panel with user management and system settings
- Developed the React frontend with TanStack Query for server state and React Context for auth
- Configured JWT authentication, role-based authorization, and reCAPTCHA
- Implemented the multi-phase order flow with background expiration processing
