"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInformationExtendedIngredientsInnerMeasuresMetric = void 0;
var RecipeInformationExtendedIngredientsInnerMeasuresMetric = (function () {
    function RecipeInformationExtendedIngredientsInnerMeasuresMetric() {
    }
    RecipeInformationExtendedIngredientsInnerMeasuresMetric.getAttributeTypeMap = function () {
        return RecipeInformationExtendedIngredientsInnerMeasuresMetric.attributeTypeMap;
    };
    RecipeInformationExtendedIngredientsInnerMeasuresMetric.discriminator = undefined;
    RecipeInformationExtendedIngredientsInnerMeasuresMetric.attributeTypeMap = [
        {
            "name": "amount",
            "baseName": "amount",
            "type": "number",
            "format": ""
        },
        {
            "name": "unitLong",
            "baseName": "unitLong",
            "type": "string",
            "format": ""
        },
        {
            "name": "unitShort",
            "baseName": "unitShort",
            "type": "string",
            "format": ""
        }
    ];
    return RecipeInformationExtendedIngredientsInnerMeasuresMetric;
}());
exports.RecipeInformationExtendedIngredientsInnerMeasuresMetric = RecipeInformationExtendedIngredientsInnerMeasuresMetric;
