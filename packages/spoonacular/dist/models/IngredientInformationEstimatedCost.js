"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientInformationEstimatedCost = void 0;
var IngredientInformationEstimatedCost = (function () {
    function IngredientInformationEstimatedCost() {
    }
    IngredientInformationEstimatedCost.getAttributeTypeMap = function () {
        return IngredientInformationEstimatedCost.attributeTypeMap;
    };
    IngredientInformationEstimatedCost.discriminator = undefined;
    IngredientInformationEstimatedCost.attributeTypeMap = [
        {
            "name": "value",
            "baseName": "value",
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
    return IngredientInformationEstimatedCost;
}());
exports.IngredientInformationEstimatedCost = IngredientInformationEstimatedCost;
