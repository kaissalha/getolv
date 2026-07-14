"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetComparableProducts200ResponseComparableProducts = void 0;
var GetComparableProducts200ResponseComparableProducts = (function () {
    function GetComparableProducts200ResponseComparableProducts() {
    }
    GetComparableProducts200ResponseComparableProducts.getAttributeTypeMap = function () {
        return GetComparableProducts200ResponseComparableProducts.attributeTypeMap;
    };
    GetComparableProducts200ResponseComparableProducts.discriminator = undefined;
    GetComparableProducts200ResponseComparableProducts.attributeTypeMap = [
        {
            "name": "calories",
            "baseName": "calories",
            "type": "Array<ComparableProduct>",
            "format": ""
        },
        {
            "name": "likes",
            "baseName": "likes",
            "type": "Array<ComparableProduct>",
            "format": ""
        },
        {
            "name": "price",
            "baseName": "price",
            "type": "Array<ComparableProduct>",
            "format": ""
        },
        {
            "name": "protein",
            "baseName": "protein",
            "type": "Array<ComparableProduct>",
            "format": ""
        },
        {
            "name": "spoonacularScore",
            "baseName": "spoonacular_score",
            "type": "Array<ComparableProduct>",
            "format": ""
        },
        {
            "name": "sugar",
            "baseName": "sugar",
            "type": "Array<ComparableProduct>",
            "format": ""
        }
    ];
    return GetComparableProducts200ResponseComparableProducts;
}());
exports.GetComparableProducts200ResponseComparableProducts = GetComparableProducts200ResponseComparableProducts;
