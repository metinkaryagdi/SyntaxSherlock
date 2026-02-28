using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Report.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCodeQualityScoreToReportMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CodeQualityScore",
                table: "ReportMetrics",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodeQualityScore",
                table: "ReportMetrics");
        }
    }
}
