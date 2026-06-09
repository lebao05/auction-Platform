using System.Security.Cryptography;

namespace Domain.Common
{
    public static class PasswordGenerator
    {
        public static string GenerateSecurePassword(int length = 12)
        {
            const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lower = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string special = "!@#$%^&*";

            var all = upper + lower + digits + special;

            var chars = new List<char>
            {
                upper[RandomNumberGenerator.GetInt32(upper.Length)],
                lower[RandomNumberGenerator.GetInt32(lower.Length)],
                digits[RandomNumberGenerator.GetInt32(digits.Length)],
                special[RandomNumberGenerator.GetInt32(special.Length)]
            };

            for (int i = chars.Count; i < length; i++)
            {
                chars.Add(all[RandomNumberGenerator.GetInt32(all.Length)]);
            }

            return string.Concat(chars.OrderBy(_ => RandomNumberGenerator.GetInt32(int.MaxValue)));
        }
    }
}
