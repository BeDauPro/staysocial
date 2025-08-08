using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;
using staysocial_be.Data;
using staysocial_be.Models;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class DepositRecognitionService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<DepositRecognitionService> _logger;
    public DepositRecognitionService(IServiceProvider services, ILogger<DepositRecognitionService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // chạy hàng ngày lúc 00:05
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var revenueSvc = scope.ServiceProvider.GetRequiredService<IRevenueService>();

                var now = DateTime.UtcNow;
                var month = now.Month;
                var year = now.Year;

                // Lấy bookings có start month = tháng này mà chưa thể công nhận deposit
                var bookings = await db.Bookings
                    .Where(b => !b.DepositRecognized
                                && b.RentalStartDate.Year == year
                                && b.RentalStartDate.Month == month)
                    .ToListAsync(stoppingToken);

                foreach (var b in bookings)
                {
                    // tìm order deposit đã thanh toán cho booking
                    var depositOrder = await db.Orders
                        .Where(o => o.BookingId == b.BookingId && o.OrderType == OrderType.Deposit && o.Status == OrderStatus.Paid)
                        .OrderBy(o => o.PaymentDate)
                        .FirstOrDefaultAsync(stoppingToken);

                    if (depositOrder != null)
                    {
                        var amount = depositOrder.Amount; // hoặc b.DepositAmount
                        await revenueSvc.AddRevenueAsync(new Revenue
                        {
                            Amount = amount,
                            RecognizedAt = DateTime.UtcNow,
                            Source = "Deposit",
                            OrderId = depositOrder.OrderId,
                            BookingId = b.BookingId
                        });

                        b.DepositRecognized = true;
                        db.Bookings.Update(b);
                        await db.SaveChangesAsync(stoppingToken);

                        _logger.LogInformation("Deposit recognized for booking {BookingId}", b.BookingId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DepositRecognitionService");
            }

            // sleep tới ngày tiếp theo 00:05 (đơn giản: delay 24h)
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
