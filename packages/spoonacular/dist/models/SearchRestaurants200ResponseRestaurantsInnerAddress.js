"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRestaurants200ResponseRestaurantsInnerAddress = void 0;
var SearchRestaurants200ResponseRestaurantsInnerAddress = (function () {
    function SearchRestaurants200ResponseRestaurantsInnerAddress() {
    }
    SearchRestaurants200ResponseRestaurantsInnerAddress.getAttributeTypeMap = function () {
        return SearchRestaurants200ResponseRestaurantsInnerAddress.attributeTypeMap;
    };
    SearchRestaurants200ResponseRestaurantsInnerAddress.discriminator = undefined;
    SearchRestaurants200ResponseRestaurantsInnerAddress.attributeTypeMap = [
        {
            "name": "streetAddr",
            "baseName": "street_addr",
            "type": "string",
            "format": ""
        },
        {
            "name": "city",
            "baseName": "city",
            "type": "string",
            "format": ""
        },
        {
            "name": "state",
            "baseName": "state",
            "type": "string",
            "format": ""
        },
        {
            "name": "zipcode",
            "baseName": "zipcode",
            "type": "string",
            "format": ""
        },
        {
            "name": "country",
            "baseName": "country",
            "type": "string",
            "format": ""
        },
        {
            "name": "lat",
            "baseName": "lat",
            "type": "number",
            "format": ""
        },
        {
            "name": "lon",
            "baseName": "lon",
            "type": "number",
            "format": ""
        },
        {
            "name": "streetAddr2",
            "baseName": "street_addr_2",
            "type": "string",
            "format": ""
        },
        {
            "name": "latitude",
            "baseName": "latitude",
            "type": "number",
            "format": ""
        },
        {
            "name": "longitude",
            "baseName": "longitude",
            "type": "number",
            "format": ""
        }
    ];
    return SearchRestaurants200ResponseRestaurantsInnerAddress;
}());
exports.SearchRestaurants200ResponseRestaurantsInnerAddress = SearchRestaurants200ResponseRestaurantsInnerAddress;
