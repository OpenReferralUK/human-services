from bs4 import BeautifulSoup
from markdown import markdown


def stripHMTL(htmlTxt):
    if htmlTxt is None:
        return None
    else:
        links = ""
        soup = BeautifulSoup(htmlTxt, features="lxml")
        text = ''.join(soup.findAll(text=True))
        for link in soup.findAll(href=True):
            links += "\n" + link['href']



        return tuple((text, links))


def stripAll(text):
    text = markdown(text)
    text = text.replace("<br", "\n<br")
    text = text.replace("/p>", "/p>\n")
    text = text.replace("<li", "\t<li")
    text = text.replace("&amp;", "&")
    text = stripHMTL(text)
    return text[0] + text[1]


if __name__ == "__main__":
    with open("./TestDescription.txt", "r") as f:
        desc = stripAll(f.read())
        print(desc)
