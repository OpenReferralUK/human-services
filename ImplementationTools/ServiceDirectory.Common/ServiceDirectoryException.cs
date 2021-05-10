using System;

namespace ServiceDirectory.Common
{
    public class ServiceDirectoryException : Exception
    {
        public ServiceDirectoryException(string message, Exception e) : base(message, e) { }
    }
}
