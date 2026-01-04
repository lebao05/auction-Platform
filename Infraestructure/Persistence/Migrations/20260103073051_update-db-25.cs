using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb25 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MessageAttachments_MessageId",
                table: "MessageAttachments");

            migrationBuilder.AddColumn<Guid>(
                name: "AppUserId",
                table: "Messages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppUserId",
                table: "MessageReadStatuses",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "MessageAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppUserId",
                table: "Conversations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_AppUserId",
                table: "Messages",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReadStatuses_AppUserId",
                table: "MessageReadStatuses",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageAttachments_MessageId",
                table: "MessageAttachments",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_AppUserId",
                table: "Conversations",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_AppUsers_AppUserId",
                table: "Conversations",
                column: "AppUserId",
                principalTable: "AppUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReadStatuses_AppUsers_AppUserId",
                table: "MessageReadStatuses",
                column: "AppUserId",
                principalTable: "AppUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AppUsers_AppUserId",
                table: "Messages",
                column: "AppUserId",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_AppUsers_AppUserId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReadStatuses_AppUsers_AppUserId",
                table: "MessageReadStatuses");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AppUsers_AppUserId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_AppUserId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_MessageReadStatuses_AppUserId",
                table: "MessageReadStatuses");

            migrationBuilder.DropIndex(
                name: "IX_MessageAttachments_MessageId",
                table: "MessageAttachments");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_AppUserId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "MessageReadStatuses");

            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "MessageAttachments");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Conversations");

            migrationBuilder.CreateIndex(
                name: "IX_MessageAttachments_MessageId",
                table: "MessageAttachments",
                column: "MessageId",
                unique: true);
        }
    }
}
