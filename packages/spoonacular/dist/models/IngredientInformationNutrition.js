"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientInformationNutrition = void 0;
var IngredientInformationNutrition = (function () {
    function IngredientInformationNutrition() {
    }
    IngredientInformationNutrition.getAttributeTypeMap = function () {
        return IngredientInformationNutrition.attributeTypeMap;
    };
    IngredientInformationNutrition.discriminator = undefined;
    IngredientInformationNutrition.attributeTypeMap = [
        {
            "name": "nutrients",
            "baseName": "nutrients",
            "type": "Set<SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner>",
            "format": ""
        },
        {
            "name": "properties",
            "baseName": "properties",
            "type": "Set<IngredientInformationNutritionPropertiesInner>",
            "format": ""
        },
        {
            "name": "caloricBreakdown",
            "baseName": "caloricBreakdown",
            "type": "SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown",
            "format": ""
        },
        {
            "name": "weightPerServing",
            "baseName": "weightPerServing",
            "type": "GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal",
            "format": ""
        }
    ];
    return IngredientInformationNutrition;
}());
exports.IngredientInformationNutrition = IngredientInformationNutrition;
