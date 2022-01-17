using System.Text;

namespace ServiceDirectory.Common
{
    public class WebServiceResponse
    {
        public WebServiceResponse(byte[] result, bool allowOrigin)
        {
            string s = Encoding.UTF8.GetString(result);
            Data = Newtonsoft.Json.JsonConvert.DeserializeObject(s);
            HashCode = GetDeterministicHashCode(s);
            HasAllowOrigin = allowOrigin;
        }

        public dynamic Data { get; private set; }
        public int HashCode { get; private set; }
        public bool HasAllowOrigin { get; private set; }

        static int GetDeterministicHashCode(string str)
        {
            unchecked
            {
                int hash1 = (5381 << 16) + 5381;
                int hash2 = hash1;

                for (int i = 0; i < str.Length; i += 2)
                {
                    hash1 = ((hash1 << 5) + hash1) ^ str[i];
                    if (i == str.Length - 1)
                        break;
                    hash2 = ((hash2 << 5) + hash2) ^ str[i + 1];
                }

                return hash1 + (hash2 * 1566083941);
            }
        }
    }
}
