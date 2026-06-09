using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb24 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Winnerid",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_Winnerid",
                table: "Products",
                column: "Winnerid");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_AppUsers_Winnerid",
                table: "Products",
                column: "Winnerid",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_AppUsers_Winnerid",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_Winnerid",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Winnerid",
                table: "Products");
        }
    }
}
