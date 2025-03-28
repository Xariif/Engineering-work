using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RefactorDbStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InsertedBy",
                table: "Turnover",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Turnover_UserId",
                table: "Turnover",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Turnover_AspNetUsers_UserId",
                table: "Turnover");

            migrationBuilder.DropIndex(
                name: "IX_Turnover_UserId",
                table: "Turnover");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Turnover",
                newName: "InsertedBy");
        }
    }
}
