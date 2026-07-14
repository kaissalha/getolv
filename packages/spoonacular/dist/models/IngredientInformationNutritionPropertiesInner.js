"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientInformationNutritionPropertiesInner = void 0;
var IngredientInformationNutritionPropertiesInner = (function () {
    function IngredientInformationNutritionPropertiesInner() {
    }
    IngredientInformationNutritionPropertiesInner.getAttributeTypeMap = function () {
        return IngredientInformationNutritionPropertiesInner.attributeTypeMap;
    };
    IngredientInformationNutritionPropertiesInner.discriminator = undefined;
    IngredientInformationNutritionPropertiesInner.attributeTypeMap = [
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
        }
    ];
    return IngredientInformationNutritionPropertiesInner;
}());
exports.IngredientInformationNutritionPropertiesInner = IngredientInformationNutritionPropertiesInner;
