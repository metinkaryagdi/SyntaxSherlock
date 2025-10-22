using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Report.Api.Migrations
{
    /// <inheritdoc />
    public partial class SyncModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReportMetricId",
                table: "LintingIssues",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LintingIssues_ReportMetricId",
                table: "LintingIssues",
                column: "ReportMetricId");

            migrationBuilder.AddForeignKey(
                name: "FK_LintingIssues_ReportMetrics_ReportMetricId",
                table: "LintingIssues",
                column: "ReportMetricId",
                principalTable: "ReportMetrics",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LintingIssues_ReportMetrics_ReportMetricId",
                table: "LintingIssues");

            migrationBuilder.DropIndex(
                name: "IX_LintingIssues_ReportMetricId",
                table: "LintingIssues");

            migrationBuilder.DropColumn(
                name: "ReportMetricId",
                table: "LintingIssues");
        }
    }
}
