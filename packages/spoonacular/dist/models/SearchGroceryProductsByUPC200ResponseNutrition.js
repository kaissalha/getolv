"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchGroceryProductsByUPC200ResponseNutrition = void 0;
var SearchGroceryProductsByUPC200ResponseNutrition = (function () {
    function SearchGroceryProductsByUPC200ResponseNutrition() {
    }
    SearchGroceryProductsByUPC200ResponseNutrition.getAttributeTypeMap = function () {
        return SearchGroceryProductsByUPC200ResponseNutrition.attributeTypeMap;
    };
    SearchGroceryProductsByUPC200ResponseNutrition.discriminator = undefined;
    SearchGroceryProductsByUPC200ResponseNutrition.attributeTypeMap = [
        {
            "name": "nutrients",
            "baseName": "nutrients",
            "type": "Set<SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner>",
            "format": ""
        },
        {
            "name": "caloricBreakdown",
            "baseName": "caloricBreakdown",
            "type": "SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown",
            "format": ""
        }
    ];
    return SearchGroceryProductsByUPC200ResponseNutrition;
}());
exports.SearchGroceryProductsByUPC200ResponseNutrition = SearchGroceryProductsByUPC200ResponseNutrition;
