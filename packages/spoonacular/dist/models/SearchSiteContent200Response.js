"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSiteContent200Response = void 0;
var SearchSiteContent200Response = (function () {
    function SearchSiteContent200Response() {
    }
    SearchSiteContent200Response.getAttributeTypeMap = function () {
        return SearchSiteContent200Response.attributeTypeMap;
    };
    SearchSiteContent200Response.discriminator = undefined;
    SearchSiteContent200Response.attributeTypeMap = [
        {
            "name": "articles",
            "baseName": "Articles",
            "type": "Array<SearchResult>",
            "format": ""
        },
        {
            "name": "groceryProducts",
            "baseName": "Grocery Products",
            "type": "Array<SearchResult>",
            "format": ""
        },
        {
            "name": "menuItems",
            "baseName": "Menu Items",
            "type": "Array<SearchResult>",
            "format": ""
        },
        {
            "name": "recipes",
            "baseName": "Recipes",
            "type": "Array<SearchResult>",
            "format": ""
        }
    ];
    return SearchSiteContent200Response;
}());
exports.SearchSiteContent200Response = SearchSiteContent200Response;
