using System;
using System.Data;

namespace ServiceDirectory.Common.Validation
{
    public class RegisteredUser
    {
        public string EmailAddress { get; set; }
        public DateTime DateRegistered { get; set; }

        public static RegisteredUser Build(IDataReader reader)
        {
            return new RegisteredUser
            {
                EmailAddress = Convert.ToString(reader["email_address"]),
                DateRegistered = Convert.ToDateTime(reader["date_registered"])
            };
        }

    }
}
