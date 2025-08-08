using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.WebUtilities;
using staysocial_be.Services.Interfaces;
using System.Net;

public class VnPayService : IVnPayService
{
    private readonly IConfiguration _config;
    private readonly string _vnpTmnCode;
    private readonly string _vnpHashSecret;
    private readonly string _vnpUrl;

    public VnPayService(IConfiguration config)
    {
        _config = config;
        _vnpTmnCode = _config["VnPay:VNP_TMNCODE"];
        _vnpHashSecret = _config["VnPay:VNP_HASH_SECRET"];
        _vnpUrl = _config["VnPay:VNP_URL"]; // e.g. https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
    }

    public string CreatePaymentUrl(int orderId, decimal amount, string description, string returnUrl)
    {
        var vnpParams = new Dictionary<string, string>()
        {
            {"vnp_Version", "2.1.0"},
            {"vnp_Command", "pay"},
            {"vnp_TmnCode", _vnpTmnCode},
            {"vnp_Amount", ((long)(amount * 100)).ToString() }, // VNPAY expects amount in cents
            {"vnp_CreateDate", DateTime.UtcNow.ToString("yyyyMMddHHmmss")},
            {"vnp_CurrCode", "VND"},
            {"vnp_IpAddr", "0.0.0.0"},
            {"vnp_Locale", "vn"},
            {"vnp_OrderInfo", description},
            {"vnp_ReturnUrl", returnUrl},
            {"vnp_TxnRef", orderId.ToString()}
        };

        // sort params by key
        var sorted = vnpParams.OrderBy(k => k.Key).ToList();

        var queryList = new List<string>();
        var hashData = new StringBuilder();

        foreach (var kv in sorted)
        {
            queryList.Add($"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}");
            if (hashData.Length > 0) hashData.Append("&");
            hashData.Append($"{kv.Key}={kv.Value}");
        }

        var sign = HmacSHA512(_vnpHashSecret, hashData.ToString());
        var url = _vnpUrl + "?" + string.Join("&", queryList) + $"&vnp_SecureHash={sign}";
        return url;
    }

    public bool ValidateResponse(IQueryCollection query)
    {
        // Build map excluding vnp_SecureHashType and vnp_SecureHash
        var data = query
            .Where(kv => kv.Key.StartsWith("vnp_") && kv.Key != "vnp_SecureHash" && kv.Key != "vnp_SecureHashType")
            .ToDictionary(k => k.Key, v => v.Value.ToString());

        var sorted = data.OrderBy(k => k.Key).ToList();
        var hashData = new StringBuilder();
        foreach (var kv in sorted)
        {
            if (hashData.Length > 0) hashData.Append('&');
            hashData.Append($"{kv.Key}={kv.Value}");
        }

        var computed = HmacSHA512(_vnpHashSecret, hashData.ToString());

        var provided = query["vnp_SecureHash"].ToString();
        return string.Equals(computed, provided, StringComparison.InvariantCultureIgnoreCase);
    }

    private static string HmacSHA512(string key, string data)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        using var hmac = new HMACSHA512(keyBytes);
        var hash = hmac.ComputeHash(dataBytes);
        return BitConverter.ToString(hash).Replace("-", "").ToLower();
    }
}
