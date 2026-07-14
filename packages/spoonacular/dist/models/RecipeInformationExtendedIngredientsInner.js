"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInformationExtendedIngredientsInner = void 0;
var RecipeInformationExtendedIngredientsInner = (function () {
    function RecipeInformationExtendedIngredientsInner() {
    }
    RecipeInformationExtendedIngredientsInner.getAttributeTypeMap = function () {
        return RecipeInformationExtendedIngredientsInner.attributeTypeMap;
    };
    RecipeInformationExtendedIngredientsInner.discriminator = undefined;
    RecipeInformationExtendedIngredientsInner.attributeTypeMap = [
        {
            "name": "aisle",
            "baseName": "aisle",
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
            "name": "consistency",
            "baseName": "consistency",
            "type": "string",
            "format": ""
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "image",
            "baseName": "image",
            "type": "string",
            "format": ""
        },
        {
            "name": "measures",
            "baseName": "measures",
            "type": "RecipeInformationExtendedIngredientsInnerMeasures",
            "format": ""
        },
        {
            "name": "meta",
            "baseName": "meta",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
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
            "name": "unit",
            "baseName": "unit",
            "type": "string",
            "format": ""
        }
    ];
    return RecipeInformationExtendedIngredientsInner;
}());
exports.RecipeInformationExtendedIngredientsInner = RecipeInformationExtendedIngredientsInner;
