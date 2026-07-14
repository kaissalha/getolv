"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown = void 0;
var SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown = (function () {
    function SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown() {
    }
    SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown.getAttributeTypeMap = function () {
        return SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown.attributeTypeMap;
    };
    SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown.discriminator = undefined;
    SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown.attributeTypeMap = [
        {
            "name": "percentProtein",
            "baseName": "percentProtein",
            "type": "number",
            "format": ""
        },
        {
            "name": "percentFat",
            "baseName": "percentFat",
            "type": "number",
            "format": ""
        },
        {
            "name": "percentCarbs",
            "baseName": "percentCarbs",
            "type": "number",
            "format": ""
        }
    ];
    return SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown;
}());
exports.SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown = SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown;
