using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Report.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReportMetrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmissionId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    ErrorCount = table.Column<int>(type: "integer", nullable: false),
                    WarningCount = table.Column<int>(type: "integer", nullable: false),
                    IssueCount = table.Column<int>(type: "integer", nullable: false),
                    FileCount = table.Column<int>(type: "integer", nullable: false),
                    CalculatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportMetrics", x => x.Id);
                    table.UniqueConstraint("AK_ReportMetrics_SubmissionId", x => x.SubmissionId);
                });

            migrationBuilder.CreateTable(
                name: "LintingIssues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmissionId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Line = table.Column<int>(type: "integer", nullable: false),
                    Column = table.Column<int>(type: "integer", nullable: false),
                    Severity = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LintingIssues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LintingIssues_ReportMetrics_SubmissionId",
                        column: x => x.SubmissionId,
                        principalTable: "ReportMetrics",
                        principalColumn: "SubmissionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LintingIssues_SubmissionId",
                table: "LintingIssues",
                column: "SubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportMetrics_SubmissionId",
                table: "ReportMetrics",
                column: "SubmissionId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LintingIssues");

            migrationBuilder.DropTable(
                name: "ReportMetrics");
        }
    }
}
