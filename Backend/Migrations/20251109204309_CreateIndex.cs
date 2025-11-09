using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kalenner.Migrations
{
    /// <inheritdoc />
    public partial class CreateIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_CompanyId",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CompanyId_ProfessionalId_Start",
                table: "Appointments",
                columns: new[] { "CompanyId", "ProfessionalId", "Start" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_CompanyId_ProfessionalId_Start",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CompanyId",
                table: "Appointments",
                column: "CompanyId");
        }
    }
}
