"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRestaurants200Response = void 0;
var SearchRestaurants200Response = (function () {
    function SearchRestaurants200Response() {
    }
    SearchRestaurants200Response.getAttributeTypeMap = function () {
        return SearchRestaurants200Response.attributeTypeMap;
    };
    SearchRestaurants200Response.discriminator = undefined;
    SearchRestaurants200Response.attributeTypeMap = [
        {
            "name": "restaurants",
            "baseName": "restaurants",
            "type": "Array<SearchRestaurants200ResponseRestaurantsInner>",
            "format": ""
        }
    ];
    return SearchRestaurants200Response;
}());
exports.SearchRestaurants200Response = SearchRestaurants200Response;
