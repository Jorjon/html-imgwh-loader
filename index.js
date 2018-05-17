const size = require("image-size");
const attrParse = require("./attributesParser");
const loaderUtils = require("loader-utils");
const path = require('path');

module.exports = function (content) {
    const root = path.dirname(this.resourcePath);
    this.cacheable && this.cacheable();
    // get src attributes from img tags
    const tags = attrParse(content, (tag, attr) => tag === "img" && attr === "src");
    tags.reverse();
    content = [content];
    tags.forEach(imgTag => {
        // get width and height
        if (!loaderUtils.isUrlRequest(imgTag.value)) return;
        const imgpath = path.resolve(root, imgTag.value);
        const wh = size(imgpath);
        const width = wh.width;
        const height = wh.height;

        // add width and height attributes to img tag
        const html = content.pop();
        const left = html.substr(0, imgTag.tagStart + imgTag.tag.length);
        const center = ' width="' + width + '" height="' + height + '"';
        const right = html.substr(imgTag.tagStart + imgTag.tag.length);

        content.push(right);
        content.push(center);
        content.push(left);
    });

    content.reverse();
    content = content.join('');
    return content;
};
