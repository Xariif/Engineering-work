using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class migartion2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantPeriods_Malls_MallId",
                table: "TenantPeriods");

            migrationBuilder.DropIndex(
                name: "IX_TenantPeriods_MallId",
                table: "TenantPeriods");

            migrationBuilder.DropColumn(
                name: "MallId",
                table: "TenantPeriods");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MallId",
                table: "TenantPeriods",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TenantPeriods_MallId",
                table: "TenantPeriods",
                column: "MallId");

            migrationBuilder.AddForeignKey(
                name: "FK_TenantPeriods_Malls_MallId",
                table: "TenantPeriods",
                column: "MallId",
                principalTable: "Malls",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
