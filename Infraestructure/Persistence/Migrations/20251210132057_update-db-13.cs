using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infraestructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SystemValue",
                table: "SystemSettings",
                type: "int",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "CreatedAt", "SystemKey", "SystemValue", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("13333333-3333-3333-3333-333333333333"), new DateTime(2025, 12, 10, 13, 20, 55, 484, DateTimeKind.Utc).AddTicks(2563), "ExtraRenewalTime", 10, null },
                    { new Guid("23333333-3333-3333-3333-333333333333"), new DateTime(2025, 12, 10, 13, 20, 55, 484, DateTimeKind.Utc).AddTicks(2565), "RenewalTriggerTime", 5, null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2025, 12, 10, 13, 20, 55, 484, DateTimeKind.Utc).AddTicks(1752), "NewProductTime", 5, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("13333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("23333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.AlterColumn<string>(
                name: "SystemValue",
                table: "SystemSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldMaxLength: 500);
        }
    }
}
