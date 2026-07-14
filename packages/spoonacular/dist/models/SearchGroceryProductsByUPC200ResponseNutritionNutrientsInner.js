"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner = void 0;
var SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner = (function () {
    function SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner() {
    }
    SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner.getAttributeTypeMap = function () {
        return SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner.attributeTypeMap;
    };
    SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner.discriminator = undefined;
    SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner.attributeTypeMap = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "amount",
            "baseName": "amount",
            "type": "number",
            "format": ""
        },
        {
            "name": "unit",
            "baseName": "unit",
            "type": "string",
            "format": ""
        },
        {
            "name": "percentOfDailyNeeds",
            "baseName": "percentOfDailyNeeds",
            "type": "number",
            "format": ""
        }
    ];
    return SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner;
}());
exports.SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner = SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner;
