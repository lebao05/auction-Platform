# Auction Platform

A full-stack real-time online auction marketplace built with **ASP.NET Core 9** and **React 19**. Users can list products, place manual or automated bids, purchase instantly via Buy Now, and communicate through real-time chat.

## Features

### Core Auction System
- **Product Listings** — sellers create auctions with images, starting price, bid step, optional Buy Now price, and duration
- **Real-time Bidding** — instant price updates via SignalR; manual and automated bidding support
- **Automated Bidding** — set a maximum bid amount; the system incrementally outbids competitors up to your ceiling
- **Buy Now** — instant purchase that immediately ends the auction
- **Background Expiration** — automatic auction closure when time expires

### User & Order Management
- **JWT Authentication** — secure token-based auth with role-based access (Bidder, Seller, Admin)
- **Seller Request Workflow** — users must request and be approved before listing products
- **Multi-phase Orders** — `WaitingForPayment` → `Paid` → `Shipped` → `Completed`
- **Password Reset** — 6-digit OTP via email with time expiration
- **Google reCAPTCHA** — bot protection on registration

### Social & Discovery
- **Real-time Chat** — SignalR-powered messaging with online presence tracking
- **Watchlist** — save products for later
- **Blacklist** — sellers can block specific bidders from their auctions
- **Ratings & Reviews** — buyers rate sellers after winning auctions
- **Q&A Comments** — product-specific question threads

### Admin Panel
- User management (ban/unban)
- Category management
- System settings configuration
- Product oversight

## Tech Stack

### Backend
- **ASP.NET Core 9** — web framework
- **Entity Framework Core 9** — ORM with SQL Server
- **Clean Architecture** — Domain, Application, Infrastructure, Presentation layers
- **CQRS** — MediatR with command/query separation
- **FluentValidation** — request validation pipeline
- **SignalR** — real-time bidding and chat
- **Azure Blob Storage** — product image uploads
- **MailKit** — transactional email notifications
- **Serilog** — structured logging
- **Swagger** — API documentation

### Frontend
- **React 19.1** — UI framework
- **Vite 7** — build tool
- **Tailwind CSS 4** — styling
- **TanStack Query 5** — server state management
- **React Router DOM 7** — routing
- **@microsoft/signalr** — real-time client
- **Axios** — HTTP client
- **Lucide React** — icons
- **React Quill** — rich text editor

## Architecture

The backend follows **Clean Architecture** with strict layer boundaries:

```
Domain          → Entities, domain events, repository interfaces (zero external dependencies)
Application     → CQRS commands/queries, MediatR handlers, business logic
Infrastructure  → EF Core, repositories, Azure Blob, email service, background services
Presentation    → API controllers, SignalR hubs, request/response DTOs
Web             → Entry point, dependency injection, middleware configuration
```

### CQRS Pattern
Every operation is either a **Command** (write) or **Query** (read), dispatched through MediatR:
- **Commands:** `CreateProduct`, `PlaceBid`, `AddToWatchlist`, `Login`, `Register`
- **Queries:** `GetProductDetails`, `SearchProducts`, `GetConversations`, `GetOrder`
- **Validation:** FluentValidation pipeline behavior applied globally

### Outbox Pattern
Domain events (`BidPlacedSuccessfullyDomainEvent`, `ProductEndedDomainEvent`) are persisted to an `OutboxMessages` table and processed asynchronously by a background service, ensuring reliable delivery even under partial failures.

## Project Structure

```
auction-Platform/
├── Domain/                    # Core business entities and domain events
│   ├── Entities/             # AppUser, Product, BiddingHistory, Order, etc.
│   ├── DomainEvents/         # BidPlacedSuccessfully, ProductEnded, etc.
│   ├── Enums/                # OrderStatus, RequestStatus, RatingType, etc.
│   └── Repositories/         # Repository interfaces
├── Application/              # CQRS handlers and business logic
│   ├── User/Commands/        # Login, Register, ChangePassword, etc.
│   ├── Product/Commands/     # CreateProduct, PlaceBid, AddToWatchlist, etc.
│   ├── Product/Queries/      # GetProductDetails, SearchProducts, GetOrder, etc.
│   └── Behaviors/            # ValidationPipelineBehavior
├── Infrastructure/           # External concerns
│   ├── Persistence/          # ApplicationDbContext, repositories, configurations
│   ├── Externals/            # AzureBlobStorageService, EmailService
│   ├── BackgroundServices/   # OutboxProcessor, ProductExpirationBackgroundService
│   └── Migrations/           # EF Core migrations
├── Presentation/             # API surface
│   ├── Controllers/          # REST endpoints
│   ├── SignalR/              # ChatHub, PresenceTracker
│   └── Contracts/            # Request/response DTOs
├── Web/                      # Entry point
│   └── Program.cs            # DI, middleware, auth configuration
└── Client/                   # React frontend
    ├── src/
    │   ├── features/         # Home, Product, Authentication, Admin, etc.
    │   ├── components/       # Reusable UI components
    │   ├── contexts/         # AuthContext, ChatContext, etc.
    │   ├── services/         # API service layer
    │   └── hooks/            # Custom React hooks
    └── public/
```

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js 18+ and npm
- SQL Server
- Azure Blob Storage account (for image uploads)
- SMTP server (for emails)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auction-Platform
   ```

2. **Configure `appsettings.json`** in the `Web` project:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.;Database=AuctionDb;Trusted_Connection=True;TrustServerCertificate=True"
     },
     "Jwt": {
       "Key": "your-secret-key-min-32-characters",
       "Issuer": "auction-platform",
       "Audience": "auction-platform-users"
     },
     "EmailSettings": {
       "SmtpServer": "smtp.gmail.com",
       "SmtpPort": 587,
       "SenderName": "Auction Platform",
       "SenderEmail": "your-email@gmail.com",
       "Username": "your-email@gmail.com",
       "Password": "your-app-password"
     },
     "AzureBlobStorage": {
       "ConnectionString": "your-azure-storage-connection-string",
       "ContainerName": "auction-images"
     },
     "ClientUrl": "http://localhost:5173"
   }
   ```

3. **Apply database migrations**
   ```bash
   cd Web
   dotnet ef database update
   ```

4. **Run the backend**
   ```bash
   dotnet run
   ```
   API will be available at `http://localhost:5125` with Swagger UI at `/`

### Frontend Setup

1. **Navigate to the Client folder**
   ```bash
   cd Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure `.env`**
   ```env
   VITE_API_BASE_URL=http://localhost:5125
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## Database Schema

### Key Entities
- **AppUser** — extends `IdentityUser<Guid>` with profile, roles, and ban status
- **Product** — auction listing with pricing, images, dates, current price, bid count
- **BiddingHistory** — every bid placed with amount, timestamp, and bidder
- **AutomatedBidding** — user's max-bid configuration per product
- **Order** — multi-phase order tracking with payment and shipping status
- **Conversation** / **Message** — real-time chat between buyers and sellers
- **Watchlist** / **Blacklist** — product-user relationship tables
- **Rating** — seller ratings from buyers
- **Comment** — product Q&A threads
- **SellerRequest** — seller approval workflow
- **SystemSetting** — configurable app parameters
- **OutboxMessage** — outbox pattern queue for domain events
- **Category** — product categorization

### Relationships
- `Product` has many `BiddingHistory`, `Comment`, `ProductImage`
- `AppUser` has many `Product` (as seller), `BiddingHistory` (as bidder), `Rating` (as buyer/seller)
- `Conversation` has many `Message` and `ConversationParticipant`
- One-to-one relationship between `Product` and `Order` (after auction ends)

## API Endpoints

### Authentication
- `POST /api/auth/register` — create new user account
- `POST /api/auth/login` — authenticate and receive JWT token
- `POST /api/auth/trigger-restore-password` — request password reset OTP
- `POST /api/auth/reset-password` — reset password with OTP

### Products
- `GET /api/products/{id}` — get product details
- `GET /api/products/search` — search and filter products
- `POST /api/products` — create new auction listing (sellers only)
- `DELETE /api/products/{id}` — delete own product (sellers only)
- `POST /api/products/{id}/bid` — place a bid
- `POST /api/products/{id}/watchlist` — add to watchlist
- `DELETE /api/products/{id}/watchlist` — remove from watchlist
- `POST /api/products/{id}/blacklist` — blacklist a bidder (sellers only)

### Orders
- `GET /api/orders/{productId}` — get order details
- `PUT /api/orders/{productId}/payment` — update payment status
- `PUT /api/orders/{productId}/shipping` — update shipping status
- `PUT /api/orders/{productId}/confirm` — confirm order completion

### Chat
- `GET /api/conversations` — list user conversations
- `GET /api/conversations/{id}` — get conversation details
- `POST /api/conversations` — create new conversation
- `POST /api/conversations/{id}/messages` — send message

### Admin
- `GET /api/users` — list all users
- `POST /api/users/{id}/ban` — ban/unban user
- `GET /api/categories` — list categories
- `POST /api/categories` — create category
- `PUT /api/categories/{id}` — update category

### SignalR Hubs
- `/hubs/chat` — real-time chat and bidding updates

## Key Design Decisions

- **Clean Architecture** — enforces separation of concerns; domain layer has no external dependencies
- **CQRS with MediatR** — all business logic flows through command/query handlers; controllers are thin
- **Outbox Pattern** — guarantees domain event delivery; emails are never lost
- **Automated Bidding Engine** — handles all edge cases: outbid scenarios, counter-bids, Buy Now triggers
- **SignalR for Real-time** — both bidding updates and chat use the same infrastructure
- **Azure Blob abstraction** — `IFileStorageService` interface allows swapping storage providers
- **Global query filters** — soft-delete and tenant isolation at EF Core level
- **Background services** — product expiration and outbox processing run independently

## Development

### Run Tests
```bash
# Backend (if tests exist)
dotnet test

# Frontend
cd Client
npm run lint
```

### Build for Production

**Backend:**
```bash
dotnet publish -c Release -o ./publish
```

**Frontend:**
```bash
cd Client
npm run build
# Output in Client/dist
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue in the repository.
