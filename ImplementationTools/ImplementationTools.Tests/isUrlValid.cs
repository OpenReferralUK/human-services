using System;
using Moq;
using Xunit;
using System.Net.Http;
using System.Net;
using ServiceDirectory.Common;

namespace ImplementationTools.Tests
{
    public class IsUrlValid
    {
        [Theory]
        [InlineData("/path")]
        [InlineData("/gjhgjg<>")]
        public void IsNotReaachable(string value)
        {
            var request = new Mock<HttpWebRequest>();
            var response = new Mock<HttpWebResponse>();
            var mock = new Mock<IWebRequestCreate>();

            response.Setup(_ => _.StatusCode).Returns(HttpStatusCode.NotFound);
            request = new Mock<HttpWebRequest>();
            request.Setup(_ => _.GetResponse()).Returns(response.Object);

            mock.Setup(_ => _.Create(It.IsAny<Uri>())).Returns(request.Object);

            var utils = new UrlChecker(mock.Object);
            bool result = utils.UrlCheck(value);

            Assert.False(result);
        }

        [Theory]
        [InlineData("https://www.bbc.co.uk")]
        public void IsReaachable(string value)
        {
            var request = new Mock<HttpWebRequest>();
            var response = new Mock<HttpWebResponse>();
            var mock = new Mock<IWebRequestCreate>();

            response.Setup(_ => _.StatusCode).Returns(HttpStatusCode.OK);
            request = new Mock<HttpWebRequest>();
            request.Setup(_ => _.GetResponse()).Returns(response.Object);
            mock.Setup(_ => _.Create(It.IsAny<Uri>())).Returns(request.Object);

            var utils = new UrlChecker(mock.Object);
            bool result = utils.UrlCheck(value);

            Assert.True(result);

        }
    }
}
