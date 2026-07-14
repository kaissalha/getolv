"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRestaurants200ResponseRestaurantsInnerLocalHours = void 0;
var SearchRestaurants200ResponseRestaurantsInnerLocalHours = (function () {
    function SearchRestaurants200ResponseRestaurantsInnerLocalHours() {
    }
    SearchRestaurants200ResponseRestaurantsInnerLocalHours.getAttributeTypeMap = function () {
        return SearchRestaurants200ResponseRestaurantsInnerLocalHours.attributeTypeMap;
    };
    SearchRestaurants200ResponseRestaurantsInnerLocalHours.discriminator = undefined;
    SearchRestaurants200ResponseRestaurantsInnerLocalHours.attributeTypeMap = [
        {
            "name": "operational",
            "baseName": "operational",
            "type": "SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational",
            "format": ""
        },
        {
            "name": "delivery",
            "baseName": "delivery",
            "type": "SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational",
            "format": ""
        },
        {
            "name": "pickup",
            "baseName": "pickup",
            "type": "SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational",
            "format": ""
        },
        {
            "name": "dineIn",
            "baseName": "dine_in",
            "type": "SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational",
            "format": ""
        }
    ];
    return SearchRestaurants200ResponseRestaurantsInnerLocalHours;
}());
exports.SearchRestaurants200ResponseRestaurantsInnerLocalHours = SearchRestaurants200ResponseRestaurantsInnerLocalHours;
