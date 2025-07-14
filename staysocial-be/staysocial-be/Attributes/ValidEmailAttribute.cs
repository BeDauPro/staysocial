using System;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace staysocial_be.Attributes
{
    public class ValidEmailAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return true; // Để [Required] xử lý null nếu cần

            var email = value.ToString();

            // Regex đơn giản kiểm tra email
            var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return regex.IsMatch(email);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"Trường {name} phải là một địa chỉ email hợp lệ.";
        }
    }

}

