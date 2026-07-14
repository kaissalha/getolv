"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientInformation = void 0;
var IngredientInformation = (function () {
    function IngredientInformation() {
    }
    IngredientInformation.getAttributeTypeMap = function () {
        return IngredientInformation.attributeTypeMap;
    };
    IngredientInformation.discriminator = undefined;
    IngredientInformation.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "original",
            "baseName": "original",
            "type": "string",
            "format": ""
        },
        {
            "name": "originalName",
            "baseName": "originalName",
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
            "name": "unitShort",
            "baseName": "unitShort",
            "type": "string",
            "format": ""
        },
        {
            "name": "unitLong",
            "baseName": "unitLong",
            "type": "string",
            "format": ""
        },
        {
            "name": "possibleUnits",
            "baseName": "possibleUnits",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "estimatedCost",
            "baseName": "estimatedCost",
            "type": "IngredientInformationEstimatedCost",
            "format": ""
        },
        {
            "name": "consistency",
            "baseName": "consistency",
            "type": "string",
            "format": ""
        },
        {
            "name": "shoppingListUnits",
            "baseName": "shoppingListUnits",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "aisle",
            "baseName": "aisle",
            "type": "string",
            "format": ""
        },
        {
            "name": "image",
            "baseName": "image",
            "type": "string",
            "format": ""
        },
        {
            "name": "meta",
            "baseName": "meta",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "nutrition",
            "baseName": "nutrition",
            "type": "IngredientInformationNutrition",
            "format": ""
        },
        {
            "name": "categoryPath",
            "baseName": "categoryPath",
            "type": "Array<string>",
            "format": ""
        }
    ];
    return IngredientInformation;
}());
exports.IngredientInformation = IngredientInformation;
