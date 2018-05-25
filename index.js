const size = require('image-size');
const attrParse = require('./attributesParser');
const loaderUtils = require("loader-utils");
const path = require('path');

module.exports = function (content) {
    const root = path.dirname(this.resourcePath);
    this.cacheable && this.cacheable();
    // get src attributes from img tags
    const tags = attrParse(content, (tag, attr) => {
        return tag === 'img' && (attr === 'width' || attr === 'height' || attr === 'src');
    });
    tags.reverse();
    content = [content];
    tags.forEach(imgTag => {
        // get width and height
        const src = imgTag.attrs.find(x => x.name === 'src');
        if (!loaderUtils.isUrlRequest(src.value)) return;
        const imgpath = path.resolve(root, src.value);
        const wh = size(imgpath);
        const width = wh.width;
        const height = wh.height;

        // add width and height attributes to img tag
        const html = content.pop();
        const left = html.substr(0, imgTag.tagStart + imgTag.tag.length);
        const widthHtml = " width=\"" + width + "\"";
        const heightHtml = " height=\"" + height + "\"";
        const right = html.substr(imgTag.tagStart + imgTag.tag.length);

        content.push(right);
        // only add width / html if not already present
        imgTag.attrs.find(x => x.name === 'height') || content.push(heightHtml);
        imgTag.attrs.find(x => x.name === 'width') || content.push(widthHtml);
        content.push(left);
    });

    content.reverse();
    content = content.join('');
    return content;
};
