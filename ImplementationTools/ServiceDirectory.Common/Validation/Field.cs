using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;

namespace ServiceDirectory.Common.Validation
{
    public class Field
    {
        public string Name { get; set; }
        public bool IsRequired { get; set; }
        public bool IsUnique { get; set; }

        public string Format { get; private set; }

        public string DataType { get; private set; }

        public int Count { get; set; }

        public List<string> Values { get; set; }

        public HashSet<string> AllowedValues { get; set; }

        public Field(string name, string format, string dataType, bool isRequired, bool isUnique, HashSet<string> allowedValues)
        {
            Format = format;
            DataType = dataType;
            Name = name;
            IsRequired = isRequired;
            IsUnique = isUnique;
            Count = 0;
            Values = new List<string>();
            AllowedValues = allowedValues;
        }

        public bool IsValidFormat()
        {
            if (string.IsNullOrEmpty(Format))
            {
                return true;
            }

            foreach (string val in Values)
            {
                if (string.IsNullOrEmpty(val))
                {
                    continue;
                }
                if (string.Equals(Format, "uuid", StringComparison.OrdinalIgnoreCase) && 
                    !Regex.IsMatch(val, @"(?im)^[{(]?[0-9A-F]{8}[-]?(?:[0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$"))
                {
                    return false;
                }
                if (string.Equals(Format, "email", StringComparison.OrdinalIgnoreCase) &&
                    !IsValidEmail(val))
                {
                    return false;
                }
                if (string.Equals(Format, "url", StringComparison.OrdinalIgnoreCase) &&
                    !IsValidUrl(val))
                {
                    return false;
                }
                if (string.Equals(Format, "currency", StringComparison.OrdinalIgnoreCase) &&
                    !IsValidCurrency(val))
                {
                    return false;
                }
                if (string.Equals(Format, "%y", StringComparison.OrdinalIgnoreCase) &&
    !Regex.IsMatch(val, @"(?:\d{4}|\d{2})"))
                {
                    return false;
                }
            }
            return true;
        }
        public bool IsValidEnum()
        {
            if (AllowedValues.Count == 0)
            {
                return true;
            }
            foreach (string val in Values)
            {
                if (string.IsNullOrEmpty(val))
                {
                    continue;
                }
                if (!AllowedValues.Contains(val))
                {
                    return false;
                }
            }
            return true;
        }
        public bool IsValidDataType()
        {
            if (string.IsNullOrEmpty(DataType))
            {
                return true;
            }

            foreach (string val in Values)
            {
                if (string.IsNullOrEmpty(val))
                {
                    continue;
                }
                if (string.Equals(DataType, "number", StringComparison.OrdinalIgnoreCase) && !IsNumber(val))
                {
                    return false;
                }
                if ((string.Equals(DataType, "date", StringComparison.OrdinalIgnoreCase) || string.Equals(DataType, "time", StringComparison.OrdinalIgnoreCase) || string.Equals(DataType, "datetime", StringComparison.OrdinalIgnoreCase)) && !IsDateTime(val))
                {
                    return false;
                }
                if (string.Equals(DataType, "boolean", StringComparison.OrdinalIgnoreCase) && !IsBoolean(val))
                {
                    return false;
                }
            }
            return true;
        }

        public static bool IsNumber(string s)
        {
            double n;
            return Double.TryParse(s, out n);
        }

        public static bool IsBoolean(string s)
        {
            bool n;
            return Boolean.TryParse(s, out n);
        }

        bool IsDateTime(string date)
        {
            DateTime dt;
            return DateTime.TryParse(date, out dt);
        }

        bool IsValidCurrency(string currency)
        {
            decimal value = -1;
            return Decimal.TryParse(currency.Trim(), NumberStyles.Number |
              NumberStyles.AllowCurrencySymbol, CultureInfo.CurrentCulture, out value);
        }

        bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        bool IsValidUrl(string url)
        {
            try
            {
                Uri uri;
                return Uri.TryCreate(url, UriKind.RelativeOrAbsolute, out uri);
            }
            catch
            {
                return false;
            }
        }
    }
}
