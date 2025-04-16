using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DbUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnovers_AspNetUsers_UserId",
                table: "Turnovers");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnovers_TurnoverPeriods_TurnoverPeriodId",
                table: "Turnovers");

            migrationBuilder.DropTable(
                name: "TurnoverPeriods");

            migrationBuilder.DropIndex(
                name: "IX_Turnovers_TurnoverPeriodId",
                table: "Turnovers");

            migrationBuilder.DropColumn(
                name: "TurnoverPeriodId",
                table: "Turnovers");

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Turnovers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Turnovers_TenantId",
                table: "Turnovers",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnovers_AspNetUsers_UserId",
                table: "Turnovers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnovers_Tenants_TenantId",
                table: "Turnovers",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnovers_AspNetUsers_UserId",
                table: "Turnovers");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnovers_Tenants_TenantId",
                table: "Turnovers");

            migrationBuilder.DropIndex(
                name: "IX_Turnovers_TenantId",
                table: "Turnovers");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Turnovers");

            migrationBuilder.AddColumn<int>(
                name: "TurnoverPeriodId",
                table: "Turnovers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TurnoverPeriods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Month = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TurnoverPeriods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TurnoverPeriods_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Turnovers_TurnoverPeriodId",
                table: "Turnovers",
                column: "TurnoverPeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_TurnoverPeriods_TenantId",
                table: "TurnoverPeriods",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnovers_AspNetUsers_UserId",
                table: "Turnovers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Turnovers_TurnoverPeriods_TurnoverPeriodId",
                table: "Turnovers",
                column: "TurnoverPeriodId",
                principalTable: "TurnoverPeriods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
