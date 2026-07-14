"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInformationExtendedIngredientsInnerMeasures = void 0;
var RecipeInformationExtendedIngredientsInnerMeasures = (function () {
    function RecipeInformationExtendedIngredientsInnerMeasures() {
    }
    RecipeInformationExtendedIngredientsInnerMeasures.getAttributeTypeMap = function () {
        return RecipeInformationExtendedIngredientsInnerMeasures.attributeTypeMap;
    };
    RecipeInformationExtendedIngredientsInnerMeasures.discriminator = undefined;
    RecipeInformationExtendedIngredientsInnerMeasures.attributeTypeMap = [
        {
            "name": "metric",
            "baseName": "metric",
            "type": "RecipeInformationExtendedIngredientsInnerMeasuresMetric",
            "format": ""
        },
        {
            "name": "us",
            "baseName": "us",
            "type": "RecipeInformationExtendedIngredientsInnerMeasuresMetric",
            "format": ""
        }
    ];
    return RecipeInformationExtendedIngredientsInnerMeasures;
}());
exports.RecipeInformationExtendedIngredientsInnerMeasures = RecipeInformationExtendedIngredientsInnerMeasures;
