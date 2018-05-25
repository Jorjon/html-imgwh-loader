/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Parser = require("fastparse");

var processAttr = function (match, strUntilValue, attributeName, attributeValue, index) {
    if (!this.isRelevantTagAttr(this.currentTag.name, attributeName)) return;
    this.currentTag.attrs.push({
        name: attributeName,
        start: index + strUntilValue.length,
        length: attributeValue.length,
        value: attributeValue,
    });
};

var leaveMatch = function (match) {
    if (this.currentTag.attrs.length > 0) {
        this.results.push({
            tag: this.currentTag.name,
            tagStart: this.currentTagIndex,
            attrs: this.currentTag.attrs,
        });
    }
    return "outside";
};

var parser = new Parser({
    outside: {
        "<!--.*?-->": true,
        "<![CDATA[.*?]]>": true,
        "<[!\\?].*?>": true,
        "<\/[^>]+>": true,
        "<([a-zA-Z\\-:]+)\\s*": function (match, tagName, index) {
            this.currentTagIndex = index + 1; // +1 to skip < character
            this.currentTag = {name: tagName, attrs: []};
            return "inside";
        }
    },
    inside: {
        "\\s+": true, // eat up whitespace
        ">": leaveMatch, // end of attributes
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*\")([^\"]*)\"": processAttr,
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*\')([^\']*)\'": processAttr,
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*)([^\\s>]+)": processAttr
    }
});

module.exports = function parse(html, isRelevantTagAttr) {
    return parser.parse("outside", html, {
        currentTag: null,
        currentTagIndex: null,
        results: [],
        isRelevantTagAttr: isRelevantTagAttr
    }).results;
};
