using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class migartion3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnover_TenantPeriods_TenantPeriodId",
                table: "Turnover");

            migrationBuilder.DropTable(
                name: "TenantPeriods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Turnover",
                table: "Turnover");

            migrationBuilder.RenameTable(
                name: "Turnover",
                newName: "Turnovers");

            migrationBuilder.RenameColumn(
                name: "TenantPeriodId",
                table: "Turnovers",
                newName: "TurnoverPeriodId");

            migrationBuilder.RenameIndex(
                name: "IX_Turnover_UserId",
                table: "Turnovers",
                newName: "IX_Turnovers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Turnover_TenantPeriodId",
                table: "Turnovers",
                newName: "IX_Turnovers_TurnoverPeriodId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Turnovers",
                table: "Turnovers",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Accesses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ResourceId = table.Column<string>(type: "text", nullable: false),
                    ResourceType = table.Column<int>(type: "integer", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Accesses_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Newsletters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MallId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Newsletters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Newsletters_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Newsletters_Malls_MallId",
                        column: x => x.MallId,
                        principalTable: "Malls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TurnoverPeriods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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
                name: "IX_Accesses_UserId",
                table: "Accesses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Newsletters_MallId",
                table: "Newsletters",
                column: "MallId");

            migrationBuilder.CreateIndex(
                name: "IX_Newsletters_UserId",
                table: "Newsletters",
                column: "UserId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnovers_AspNetUsers_UserId",
                table: "Turnovers");

            migrationBuilder.DropForeignKey(
                name: "FK_Turnovers_TurnoverPeriods_TurnoverPeriodId",
                table: "Turnovers");

            migrationBuilder.DropTable(
                name: "Accesses");

            migrationBuilder.DropTable(
                name: "Newsletters");

            migrationBuilder.DropTable(
                name: "TurnoverPeriods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Turnovers",
                table: "Turnovers");

            migrationBuilder.RenameTable(
                name: "Turnovers",
                newName: "Turnover");

            migrationBuilder.RenameColumn(
                name: "TurnoverPeriodId",
                table: "Turnover",
                newName: "TenantPeriodId");

            migrationBuilder.RenameIndex(
                name: "IX_Turnovers_UserId",
                table: "Turnover",
                newName: "IX_Turnover_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Turnovers_TurnoverPeriodId",
                table: "Turnover",
                newName: "IX_Turnover_TenantPeriodId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Turnover",
                table: "Turnover",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "TenantPeriods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TenantPeriods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TenantPeriods_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TenantPeriods_TenantId",
                table: "TenantPeriods",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Turnover_TenantPeriods_TenantPeriodId",
                table: "Turnover",
                column: "TenantPeriodId",
                principalTable: "TenantPeriods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
