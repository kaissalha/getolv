"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRestaurants200ResponseRestaurantsInner = void 0;
var SearchRestaurants200ResponseRestaurantsInner = (function () {
    function SearchRestaurants200ResponseRestaurantsInner() {
    }
    SearchRestaurants200ResponseRestaurantsInner.getAttributeTypeMap = function () {
        return SearchRestaurants200ResponseRestaurantsInner.attributeTypeMap;
    };
    SearchRestaurants200ResponseRestaurantsInner.discriminator = undefined;
    SearchRestaurants200ResponseRestaurantsInner.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "_id",
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
            "name": "phoneNumber",
            "baseName": "phone_number",
            "type": "number",
            "format": ""
        },
        {
            "name": "address",
            "baseName": "address",
            "type": "SearchRestaurants200ResponseRestaurantsInnerAddress",
            "format": ""
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "string",
            "format": ""
        },
        {
            "name": "description",
            "baseName": "description",
            "type": "string",
            "format": ""
        },
        {
            "name": "localHours",
            "baseName": "local_hours",
            "type": "SearchRestaurants200ResponseRestaurantsInnerLocalHours",
            "format": ""
        },
        {
            "name": "cuisines",
            "baseName": "cuisines",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "foodPhotos",
            "baseName": "food_photos",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "logoPhotos",
            "baseName": "logo_photos",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "storePhotos",
            "baseName": "store_photos",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "dollarSigns",
            "baseName": "dollar_signs",
            "type": "number",
            "format": ""
        },
        {
            "name": "pickupEnabled",
            "baseName": "pickup_enabled",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "deliveryEnabled",
            "baseName": "delivery_enabled",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "isOpen",
            "baseName": "is_open",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "offersFirstPartyDelivery",
            "baseName": "offers_first_party_delivery",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "offersThirdPartyDelivery",
            "baseName": "offers_third_party_delivery",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "miles",
            "baseName": "miles",
            "type": "number",
            "format": ""
        },
        {
            "name": "weightedRatingValue",
            "baseName": "weighted_rating_value",
            "type": "number",
            "format": ""
        },
        {
            "name": "aggregatedRatingCount",
            "baseName": "aggregated_rating_count",
            "type": "number",
            "format": ""
        }
    ];
    return SearchRestaurants200ResponseRestaurantsInner;
}());
exports.SearchRestaurants200ResponseRestaurantsInner = SearchRestaurants200ResponseRestaurantsInner;
