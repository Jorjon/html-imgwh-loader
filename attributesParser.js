/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Parser = require("fastparse");

var processMatch = function (match, strUntilValue, name, value, index) {
    if (!this.isRelevantTagAttr(this.currentTag, name)) return;
    this.results.push({
        tag: this.currentTag,
        tagStart: this.currentTagIndex,
        start: index + strUntilValue.length,
        length: value.length,
        value: value
    });
};

var parser = new Parser({
    outside: {
        "<!--.*?-->": true,
        "<![CDATA[.*?]]>": true,
        "<[!\\?].*?>": true,
        "<\/[^>]+>": true,
        "<([a-zA-Z\\-:]+)\\s*": function (match, tagName, index) {
            this.currentTagIndex = index + 1; // +1 to skip < character
            this.currentTag = tagName;
            return "inside";
        }
    },
    inside: {
        "\\s+": true, // eat up whitespace
        ">": "outside", // end of attributes
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*\")([^\"]*)\"": processMatch,
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*\')([^\']*)\'": processMatch,
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*)([^\\s>]+)": processMatch
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
