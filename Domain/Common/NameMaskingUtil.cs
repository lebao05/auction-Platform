using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common
{
    public static class NameMaskingUtil
    {
        /// <summary>
        /// Mask name but keep original length.
        /// Example: "Nguyen Van A" -> "N**** *** A"
        /// </summary>
        public static string? MaskKeepLength(string? fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                return null;

            var parts = fullName
                .Trim()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < parts.Length; i++)
            {
                parts[i] = MaskWordKeepLength(parts[i]);
            }

            return string.Join(" ", parts);
        }

        private static string MaskWordKeepLength(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
                return word;

            if (word.Length <= 1)
                return word;

            return word[0] + new string('*', word.Length - 1);
        }
    }
}
