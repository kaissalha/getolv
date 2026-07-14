"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRecipes200ResponseResultsInner = void 0;
var SearchRecipes200ResponseResultsInner = (function () {
    function SearchRecipes200ResponseResultsInner() {
    }
    SearchRecipes200ResponseResultsInner.getAttributeTypeMap = function () {
        return SearchRecipes200ResponseResultsInner.attributeTypeMap;
    };
    SearchRecipes200ResponseResultsInner.discriminator = undefined;
    SearchRecipes200ResponseResultsInner.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        },
        {
            "name": "image",
            "baseName": "image",
            "type": "string",
            "format": ""
        },
        {
            "name": "imageType",
            "baseName": "imageType",
            "type": "string",
            "format": ""
        }
    ];
    return SearchRecipes200ResponseResultsInner;
}());
exports.SearchRecipes200ResponseResultsInner = SearchRecipes200ResponseResultsInner;
