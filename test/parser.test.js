import parser from '../attributesParser';

function test(name, html, result) {
    it("should parse " + name, () => {
        expect(parser(html, (tag, attr) => {
            if (tag === "img" && attr === "src") return true;
            if (tag === "link" && attr === "href") return true;
            if (tag === "div" && attr === "data-videomp4") return true;
            if (tag === "use" && attr === "xlink:href") return true;
            return false;
        }).map(function (match) {
            return match.attrs[0].value
        })).toEqual(result);
    });
}

describe("parser", () => {
    test("normal", 'Text <img src="image.png"><img src="image2.png">', ["image.png", "image2.png"]);
    test("single-quotes", "Text <img src='image.png'><img src='image2.png'>", ["image.png", "image2.png"]);
    test("whitespace", 'T ex t  <img \t  src =   "image.png"   >  <img\t\nsrc\n=\n"image2.png"\n>', ["image.png", "image2.png"]);
    test("whitespace2", 'Text < img src="image.png" >', []);
    test("wrong <", 'Text <<img src="image.png">', ["image.png"]);
    test("wrong >", 'Text ><img src="image.png">', ["image.png"]);
    test("no quot", '<img src=image.png>', ["image.png"]);
    test("first tag", '<img src="image.png">', ["image.png"]);
    test("comment", '<!--<img src="image.png">-->', []);
    test("comment2", '<!--<!--<img src="image.png">-->', []);
    test("comment3", '<!--><img src="image.png">-->', []);
    test("comment4", '<!----><img src="image.png">-->', ["image.png"]);
    test("tags", '<img src="image.png"><script src="script.js"></script><link type="stylesheet" href="style.css">', ["image.png", "style.css"]);
    test("cdata", '<![CDATA[<img src="image.png">]]><img src="image2.png">', ["image2.png"]);
    test("doctype", '<!doctype html><img src="image.png">', ["image.png"]);
    test("alphanumeric", '<div data-videomp4="video.mp4"></div>', ["video.mp4"]);
    test("use", '<use xlink:href="vector.svg" />', ["vector.svg"]);
});

describe("locations", function () {
    it("should report correct locations", function () {
        expect(parser('<img  src= "image.png">', () => true)).toEqual([{
            attrs: [{
                start: 12,
                length: 9,
                value: "image.png",
                name: "src",
            }],
            tagStart: 1,
            tag: "img",
        }]);
    });
});