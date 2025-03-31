using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class migartion1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
