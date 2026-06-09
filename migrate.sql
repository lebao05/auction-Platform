
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AppUsers] (
    [Id] uniqueidentifier NOT NULL,
    [FullName] nvarchar(100) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [AvatarUrl] nvarchar(max) NULL,
    [DateOfBirth] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsBanned] bit NOT NULL,
    [ForgotPasswordOtpHash] nvarchar(max) NULL,
    [ForgotPasswordOtpExpiredAt] datetime2 NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(100) NOT NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AppUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoles] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [Categories] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [ParentId] uniqueidentifier NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Categories_Categories_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [OutboxMessages] (
    [Id] uniqueidentifier NOT NULL,
    [Type] nvarchar(250) NOT NULL,
    [PayLoad] nvarchar(max) NOT NULL,
    [OccurredOnUtc] datetime2 NOT NULL,
    [ProcessedOnUtc] datetime2 NULL,
    [Error] nvarchar(2000) NULL,
    CONSTRAINT [PK_OutboxMessages] PRIMARY KEY ([Id])
);

CREATE TABLE [SystemSettings] (
    [Id] uniqueidentifier NOT NULL,
    [SystemKey] nvarchar(100) NOT NULL,
    [SystemValue] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_SystemSettings] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] uniqueidentifier NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] uniqueidentifier NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Conversations] (
    [Id] uniqueidentifier NOT NULL,
    [CreatedByUserId] uniqueidentifier NOT NULL,
    [AppUserId] uniqueidentifier NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Conversations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Conversations_AppUsers_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AppUsers] ([Id]),
    CONSTRAINT [FK_Conversations_AppUsers_CreatedByUserId] FOREIGN KEY ([CreatedByUserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [EmailLogs] (
    [Id] uniqueidentifier NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [ReceiverId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_EmailLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EmailLogs_AppUsers_ReceiverId] FOREIGN KEY ([ReceiverId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [SellerRequests] (
    [Id] uniqueidentifier NOT NULL,
    [Status] int NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_SellerRequests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SellerRequests_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] uniqueidentifier NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] uniqueidentifier NOT NULL,
    [RoleId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Products] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [Name_NoAccent] nvarchar(max) NOT NULL,
    [BuyNowPrice] bigint NULL,
    [StartPrice] bigint NOT NULL,
    [StepPrice] bigint NOT NULL,
    [AllowAll] bit NOT NULL,
    [BiddingCount] int NOT NULL,
    [IsAutoRenewal] bit NOT NULL,
    [Description_NoAccent] nvarchar(max) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [SellerId] uniqueidentifier NOT NULL,
    [CategoryId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [ShippingAddress] nvarchar(max) NULL,
    [PaymentInvoiceUrl] nvarchar(max) NULL,
    [ShippingPhone] nvarchar(max) NULL,
    [ShippingInvoiceUrl] nvarchar(max) NOT NULL,
    [Winnerid] uniqueidentifier NULL,
    [OrderStatus] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Products_AppUsers_SellerId] FOREIGN KEY ([SellerId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Products_AppUsers_Winnerid] FOREIGN KEY ([Winnerid]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [ConversationParticipants] (
    [Id] uniqueidentifier NOT NULL,
    [ConversationId] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [JoinedAt] datetime2 NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_ConversationParticipants] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ConversationParticipants_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ConversationParticipants_Conversations_ConversationId] FOREIGN KEY ([ConversationId]) REFERENCES [Conversations] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Messages] (
    [Id] uniqueidentifier NOT NULL,
    [ConversationId] uniqueidentifier NOT NULL,
    [SenderId] uniqueidentifier NOT NULL,
    [Content] nvarchar(4000) NULL,
    [MessageType] int NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [AppUserId] uniqueidentifier NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Messages_AppUsers_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AppUsers] ([Id]),
    CONSTRAINT [FK_Messages_AppUsers_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Messages_Conversations_ConversationId] FOREIGN KEY ([ConversationId]) REFERENCES [Conversations] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AutomatedBiddings] (
    [Id] uniqueidentifier NOT NULL,
    [MaxBidAmount] bigint NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [BidderId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_AutomatedBiddings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AutomatedBiddings_AppUsers_BidderId] FOREIGN KEY ([BidderId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_AutomatedBiddings_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [BiddingHistories] (
    [Id] uniqueidentifier NOT NULL,
    [BidAmount] bigint NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [BidderId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_BiddingHistories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BiddingHistories_AppUsers_BidderId] FOREIGN KEY ([BidderId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_BiddingHistories_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [BlackLists] (
    [Id] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [SellerId] uniqueidentifier NOT NULL,
    [BidderId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_BlackLists] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BlackLists_AppUsers_BidderId] FOREIGN KEY ([BidderId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_BlackLists_AppUsers_SellerId] FOREIGN KEY ([SellerId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_BlackLists_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Comments] (
    [Id] uniqueidentifier NOT NULL,
    [Content] nvarchar(1000) NOT NULL,
    [ParentId] uniqueidentifier NULL,
    [UserId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Comments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Comments_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Comments_Comments_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [Comments] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Comments_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ProductImages] (
    [Id] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(500) NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [IsMain] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_ProductImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProductImages_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Ratings] (
    [Id] uniqueidentifier NOT NULL,
    [RatingType] int NOT NULL,
    [Comment] nvarchar(500) NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [RaterId] uniqueidentifier NOT NULL,
    [RatedUserId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Ratings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Ratings_AppUsers_RatedUserId] FOREIGN KEY ([RatedUserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Ratings_AppUsers_RaterId] FOREIGN KEY ([RaterId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Ratings_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Watchlists] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Watchlists] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Watchlists_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Watchlists_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [MessageAttachments] (
    [Id] uniqueidentifier NOT NULL,
    [MessageId] uniqueidentifier NOT NULL,
    [FileUrl] nvarchar(2000) NOT NULL,
    [FileName] nvarchar(255) NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] int NOT NULL,
    [MimeType] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_MessageAttachments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MessageAttachments_Messages_MessageId] FOREIGN KEY ([MessageId]) REFERENCES [Messages] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [MessageReadStatuses] (
    [Id] uniqueidentifier NOT NULL,
    [MessageId] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [ReadAt] datetime2 NULL,
    [AppUserId] uniqueidentifier NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_MessageReadStatuses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MessageReadStatuses_AppUsers_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AppUsers] ([Id]),
    CONSTRAINT [FK_MessageReadStatuses_AppUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AppUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_MessageReadStatuses_Messages_MessageId] FOREIGN KEY ([MessageId]) REFERENCES [Messages] ([Id]) ON DELETE CASCADE
);

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'ConcurrencyStamp', N'Name', N'NormalizedName') AND [object_id] = OBJECT_ID(N'[AspNetRoles]'))
    SET IDENTITY_INSERT [AspNetRoles] ON;
INSERT INTO [AspNetRoles] ([Id], [ConcurrencyStamp], [Name], [NormalizedName])
VALUES ('11111111-1111-1111-1111-111111111111', NULL, N'Bidder', N'BIDDER'),
('22222222-2222-2222-2222-222222222222', NULL, N'Seller', N'SELLER'),
('22222222-2222-2222-3333-222222222222', NULL, N'User', N'User'),
('33333333-3333-3333-3333-333333333333', NULL, N'Admin', N'ADMIN');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'ConcurrencyStamp', N'Name', N'NormalizedName') AND [object_id] = OBJECT_ID(N'[AspNetRoles]'))
    SET IDENTITY_INSERT [AspNetRoles] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'SystemKey', N'SystemValue', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[SystemSettings]'))
    SET IDENTITY_INSERT [SystemSettings] ON;
INSERT INTO [SystemSettings] ([Id], [CreatedAt], [SystemKey], [SystemValue], [UpdatedAt])
VALUES ('13333333-3333-3333-3333-333333333333', '0001-01-01T00:00:00.0000000', N'ExtraRenewalTime', 10, NULL),
('23333333-3333-3333-3333-333333333333', '0001-01-01T00:00:00.0000000', N'RenewalTriggerTime', 5, NULL),
('33333333-3333-3333-3333-333333333333', '0001-01-01T00:00:00.0000000', N'NewProductTime', 5, NULL);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'SystemKey', N'SystemValue', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[SystemSettings]'))
    SET IDENTITY_INSERT [SystemSettings] OFF;

CREATE UNIQUE INDEX [EmailIndex] ON [AppUsers] ([NormalizedEmail]) WHERE [NormalizedEmail] IS NOT NULL;

CREATE UNIQUE INDEX [IX_AppUsers_Email] ON [AppUsers] ([Email]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AppUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [IX_AutomatedBiddings_BidderId] ON [AutomatedBiddings] ([BidderId]);

CREATE INDEX [IX_AutomatedBiddings_ProductId] ON [AutomatedBiddings] ([ProductId]);

CREATE INDEX [IX_BiddingHistories_BidderId] ON [BiddingHistories] ([BidderId]);

CREATE INDEX [IX_BiddingHistories_ProductId] ON [BiddingHistories] ([ProductId]);

CREATE INDEX [IX_BlackLists_BidderId] ON [BlackLists] ([BidderId]);

CREATE INDEX [IX_BlackLists_ProductId] ON [BlackLists] ([ProductId]);

CREATE INDEX [IX_BlackLists_SellerId] ON [BlackLists] ([SellerId]);

CREATE INDEX [IX_Categories_ParentId] ON [Categories] ([ParentId]);

CREATE INDEX [IX_Comments_ParentId] ON [Comments] ([ParentId]);

CREATE INDEX [IX_Comments_ProductId] ON [Comments] ([ProductId]);

CREATE INDEX [IX_Comments_UserId] ON [Comments] ([UserId]);

CREATE INDEX [IX_ConversationParticipants_ConversationId] ON [ConversationParticipants] ([ConversationId]);

CREATE INDEX [IX_ConversationParticipants_UserId] ON [ConversationParticipants] ([UserId]);

CREATE INDEX [IX_Conversations_AppUserId] ON [Conversations] ([AppUserId]);

CREATE INDEX [IX_Conversations_CreatedByUserId] ON [Conversations] ([CreatedByUserId]);

CREATE INDEX [IX_EmailLogs_ReceiverId] ON [EmailLogs] ([ReceiverId]);

CREATE INDEX [IX_MessageAttachments_MessageId] ON [MessageAttachments] ([MessageId]);

CREATE INDEX [IX_MessageReadStatuses_AppUserId] ON [MessageReadStatuses] ([AppUserId]);

CREATE INDEX [IX_MessageReadStatuses_MessageId] ON [MessageReadStatuses] ([MessageId]);

CREATE INDEX [IX_MessageReadStatuses_UserId] ON [MessageReadStatuses] ([UserId]);

CREATE INDEX [IX_Messages_AppUserId] ON [Messages] ([AppUserId]);

CREATE INDEX [IX_Messages_ConversationId] ON [Messages] ([ConversationId]);

CREATE INDEX [IX_Messages_SenderId] ON [Messages] ([SenderId]);

CREATE INDEX [IX_OutboxMessages_ProcessedOnUtc] ON [OutboxMessages] ([ProcessedOnUtc]);

CREATE INDEX [IX_ProductImages_ProductId] ON [ProductImages] ([ProductId]);

CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);

CREATE INDEX [IX_Products_SellerId] ON [Products] ([SellerId]);

CREATE INDEX [IX_Products_Winnerid] ON [Products] ([Winnerid]);

CREATE INDEX [IX_Ratings_ProductId] ON [Ratings] ([ProductId]);

CREATE INDEX [IX_Ratings_RatedUserId] ON [Ratings] ([RatedUserId]);

CREATE INDEX [IX_Ratings_RaterId] ON [Ratings] ([RaterId]);

CREATE INDEX [IX_SellerRequests_UserId] ON [SellerRequests] ([UserId]);

CREATE INDEX [IX_Watchlists_ProductId] ON [Watchlists] ([ProductId]);

CREATE UNIQUE INDEX [IX_Watchlists_UserId_ProductId] ON [Watchlists] ([UserId], [ProductId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260107091726_init', N'9.0.10');


COMMIT;
GO

CREATE FULLTEXT CATALOG FTC_Products
WITH ACCENT_SENSITIVITY = OFF;


CREATE FULLTEXT CATALOG FTC_AppUsers
WITH ACCENT_SENSITIVITY = OFF;
GO

CREATE FULLTEXT INDEX ON AppUsers
(
    FullName LANGUAGE 1033
)
KEY INDEX PK_AppUsers
ON FTC_AppUsers
WITH CHANGE_TRACKING AUTO;
GO

CREATE FULLTEXT INDEX ON Products
(
    Name LANGUAGE 1033,
    Description LANGUAGE 1033
)
KEY INDEX PK_Products
ON FTC_Products
WITH CHANGE_TRACKING AUTO;