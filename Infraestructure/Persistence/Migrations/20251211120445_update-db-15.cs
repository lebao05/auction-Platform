using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb15 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AutomatedBiddings_AppUsers_BidderId",
                table: "AutomatedBiddings");

            migrationBuilder.AddForeignKey(
                name: "FK_AutomatedBiddings_AppUsers_BidderId",
                table: "AutomatedBiddings",
                column: "BidderId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AutomatedBiddings_AppUsers_BidderId",
                table: "AutomatedBiddings");

            migrationBuilder.AddForeignKey(
                name: "FK_AutomatedBiddings_AppUsers_BidderId",
                table: "AutomatedBiddings",
                column: "BidderId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
