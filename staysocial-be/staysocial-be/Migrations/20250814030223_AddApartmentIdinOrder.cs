using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace staysocial_be.Migrations
{
    public partial class AddApartmentIdinOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApartmentId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApartmentId",
                table: "Orders");
        }
    }
}
