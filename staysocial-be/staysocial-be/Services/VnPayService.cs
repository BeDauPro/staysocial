using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using staysocial_be.Services.Interfaces;

public class VnPayService : IVnPayService
{
    private readonly string _tmnCode;
    private readonly string _hashSecret;
    private readonly string _vnpUrl;
    private readonly string _ipnUrl; // optional
    private readonly ILogger<VnPayService> _logger;

    public VnPayService(IConfiguration config, ILogger<VnPayService> logger)
    {
        _tmnCode = config["VnPay:TmnCode"] ?? throw new ArgumentNullException("VnPay:TmnCode");
        _hashSecret = config["VnPay:HashSecret"] ?? throw new ArgumentNullException("VnPay:HashSecret");
        _vnpUrl = config["VnPay:Url"] ?? throw new ArgumentNullException("VnPay:Url");
        _ipnUrl = config["VnPay:IpnUrl"]; // có thể để trống (VNPay có thể cấu hình IPN ở portal)
        _logger = logger;
    }

    public string CreatePaymentUrl(int orderId, decimal amount, string description, string returnUrl, string ipAddress)
    {
        if (string.IsNullOrWhiteSpace(returnUrl))
            throw new ArgumentException("ReturnUrl is required", nameof(returnUrl));

        // Theo chuẩn VNPay: Amount = VND * 100 (không có dấu thập phân)
        var amountVnp = ((long)Math.Round(amount * 100M, 0)).ToString();

        // Hạn thanh toán: +15 phút (tuỳ bạn)
        var now = DateTime.UtcNow.AddHours(7); // VN time
        var expire = now.AddMinutes(15);

        var vnpParams = new SortedDictionary<string, string>
        {
            ["vnp_Version"] = "2.1.0",
            ["vnp_Command"] = "pay",
            ["vnp_TmnCode"] = _tmnCode,
            ["vnp_Amount"] = amountVnp,
            ["vnp_CreateDate"] = now.ToString("yyyyMMddHHmmss"),
            ["vnp_CurrCode"] = "VND",
            ["vnp_IpAddr"] = string.IsNullOrWhiteSpace(ipAddress) ? "127.0.0.1" : ipAddress,
            ["vnp_Locale"] = "vn",
            ["vnp_OrderInfo"] = string.IsNullOrWhiteSpace(description) ? $"Thanh toan don hang {orderId}" : description,
            ["vnp_ReturnUrl"] = returnUrl,
            ["vnp_TxnRef"] = orderId.ToString(),
            ["vnp_OrderType"] = "other",
            ["vnp_ExpireDate"] = expire.ToString("yyyyMMddHHmmss")
        };

        // Tuỳ chọn: đính kèm IpnUrl nếu bạn muốn override cấu hình ở portal
        if (!string.IsNullOrWhiteSpace(_ipnUrl))
        {
            vnpParams["vnp_IpnUrl"] = _ipnUrl;
        }

        string BuildQuery(IEnumerable<KeyValuePair<string, string>> items) =>
            string.Join("&", items.Select(kv => $"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}"));

        var signData = BuildQuery(vnpParams);

        var secureHash = HmacSHA512(_hashSecret, signData).ToUpperInvariant();

        var queryString = $"{signData}&vnp_SecureHash={secureHash}";
        var fullUrl = $"{_vnpUrl}?{queryString}";

        _logger.LogInformation("VNPay create url: {Url}", fullUrl);
        return fullUrl;
    }

    public bool ValidateResponse(IDictionary<string, string> queryParams)
    {
        // Lấy hash VNPay trả về
        if (!queryParams.TryGetValue("vnp_SecureHash", out var vnpSecureHash) || string.IsNullOrWhiteSpace(vnpSecureHash))
            return false;

        // Lọc tham số vnp_, loại bỏ hash & hashType, sắp xếp theo key
        var filtered = queryParams
            .Where(kv => kv.Key.StartsWith("vnp_") && kv.Key != "vnp_SecureHash" && kv.Key != "vnp_SecureHashType")
            .OrderBy(kv => kv.Key)
            .ToList();
        string BuildQuery(IEnumerable<KeyValuePair<string, string>> items) =>
            string.Join("&", items.Select(kv => $"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}"));

        var signData = BuildQuery(filtered);
        var computed = HmacSHA512(_hashSecret, signData).ToUpperInvariant();

        var ok = string.Equals(computed, vnpSecureHash, StringComparison.OrdinalIgnoreCase);
        if (!ok)
            _logger.LogWarning("VNPay invalid signature. computed={Computed} recv={Recv} data={Data}",
                computed, vnpSecureHash, signData);

        return ok;
    }

    private static string HmacSHA512(string key, string data)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        using var hmac = new HMACSHA512(keyBytes);
        var hash = hmac.ComputeHash(dataBytes);
        var sb = new StringBuilder(hash.Length * 2);
        foreach (var b in hash) sb.AppendFormat("{0:x2}", b);
        return sb.ToString();
    }
}
