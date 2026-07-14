"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
var SearchResult = (function () {
    function SearchResult() {
    }
    SearchResult.getAttributeTypeMap = function () {
        return SearchResult.attributeTypeMap;
    };
    SearchResult.discriminator = undefined;
    SearchResult.attributeTypeMap = [
        {
            "name": "image",
            "baseName": "image",
            "type": "string",
            "format": ""
        },
        {
            "name": "link",
            "baseName": "link",
            "type": "string",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "string",
            "format": ""
        },
        {
            "name": "kvtable",
            "baseName": "kvtable",
            "type": "string",
            "format": ""
        },
        {
            "name": "content",
            "baseName": "content",
            "type": "string",
            "format": ""
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "relevance",
            "baseName": "relevance",
            "type": "number",
            "format": ""
        }
    ];
    return SearchResult;
}());
exports.SearchResult = SearchResult;
