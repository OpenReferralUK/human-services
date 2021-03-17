using System;
using Xunit;
using ServiceDirectoryExporter.Pages;
using ServiceDirectory.Common;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using Moq.Protected;
using System.Threading;
using System.Threading.Tasks;

namespace ImplementationTools.Tests
{
    
    public class IsUrl
    {

        [Theory]
        [InlineData("/path")]
        [InlineData("ftp://www.something.com")]
        public void isURLStringValid(string value)
        {
            var logger = new Mock<ILogger>();

            Urls url = new Urls(value);
            
            bool result = url.UrlValid();
            Assert.False(result);

        }

        [Theory]
        [InlineData("https://outpost-api-service.herokuapp.com/api/v1/")]
        [InlineData("https://api.porism.com/ServiceDirectoryServiceBlackburn/")]
        [InlineData("https://lgaapi.connecttosupport.org/")]
        public void isURLStringValidTrue(string value)
        {
     
            var logger = new Mock<ILogger>();
            Urls url = new Urls(value);
            bool result =url.UrlValid();
            Assert.True(result);

        }
       
    }
}
