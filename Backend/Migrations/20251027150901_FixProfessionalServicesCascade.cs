using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kalenner.Migrations
{
    /// <inheritdoc />
    public partial class FixProfessionalServicesCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfessionalServices_Services_ServiceId",
                table: "ProfessionalServices");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfessionalServices_Services_ServiceId",
                table: "ProfessionalServices",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfessionalServices_Services_ServiceId",
                table: "ProfessionalServices");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfessionalServices_Services_ServiceId",
                table: "ProfessionalServices",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
