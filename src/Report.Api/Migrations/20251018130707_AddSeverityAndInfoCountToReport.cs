using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Report.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSeverityAndInfoCountToReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InfoCount",
                table: "ReportMetrics",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Severity",
                table: "LintingIssues",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<Guid>(
                name: "MetricId",
                table: "LintingIssues",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InfoCount",
                table: "ReportMetrics");

            migrationBuilder.DropColumn(
                name: "MetricId",
                table: "LintingIssues");

            migrationBuilder.AlterColumn<string>(
                name: "Severity",
                table: "LintingIssues",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);
        }
    }
}
