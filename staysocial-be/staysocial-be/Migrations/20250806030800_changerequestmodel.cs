using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace staysocial_be.Migrations
{
    public partial class changerequestmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LandlordRequests_AspNetUsers_UserId",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "ApprovedAt",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "LandlordRequests");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "LandlordRequests",
                newName: "AppUserId");

            migrationBuilder.RenameColumn(
                name: "RequestedAt",
                table: "LandlordRequests",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_LandlordRequests_UserId",
                table: "LandlordRequests",
                newName: "IX_LandlordRequests_AppUserId");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "LandlordRequests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "LandlordRequests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "LandlordRequests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RejectReason",
                table: "LandlordRequests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "LandlordRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_LandlordRequests_AspNetUsers_AppUserId",
                table: "LandlordRequests",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LandlordRequests_AspNetUsers_AppUserId",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "RejectReason",
                table: "LandlordRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "LandlordRequests");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "LandlordRequests",
                newName: "RequestedAt");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "LandlordRequests",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_LandlordRequests_AppUserId",
                table: "LandlordRequests",
                newName: "IX_LandlordRequests_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedAt",
                table: "LandlordRequests",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "LandlordRequests",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "LandlordRequests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_LandlordRequests_AspNetUsers_UserId",
                table: "LandlordRequests",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
