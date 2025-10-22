using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MetricsWorker.Migrations
{
    /// <inheritdoc />
    public partial class AddScore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CodeQualityScore",
                table: "Metrics",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodeQualityScore",
                table: "Metrics");
        }
    }
}
