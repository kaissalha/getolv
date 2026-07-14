"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnalyzedRecipeInstructions200ResponseInnerStepsInner = void 0;
var GetAnalyzedRecipeInstructions200ResponseInnerStepsInner = (function () {
    function GetAnalyzedRecipeInstructions200ResponseInnerStepsInner() {
    }
    GetAnalyzedRecipeInstructions200ResponseInnerStepsInner.getAttributeTypeMap = function () {
        return GetAnalyzedRecipeInstructions200ResponseInnerStepsInner.attributeTypeMap;
    };
    GetAnalyzedRecipeInstructions200ResponseInnerStepsInner.discriminator = undefined;
    GetAnalyzedRecipeInstructions200ResponseInnerStepsInner.attributeTypeMap = [
        {
            "name": "number",
            "baseName": "number",
            "type": "number",
            "format": ""
        },
        {
            "name": "step",
            "baseName": "step",
            "type": "string",
            "format": ""
        },
        {
            "name": "ingredients",
            "baseName": "ingredients",
            "type": "Set<GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner>",
            "format": ""
        },
        {
            "name": "equipment",
            "baseName": "equipment",
            "type": "Set<GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner>",
            "format": ""
        }
    ];
    return GetAnalyzedRecipeInstructions200ResponseInnerStepsInner;
}());
exports.GetAnalyzedRecipeInstructions200ResponseInnerStepsInner = GetAnalyzedRecipeInstructions200ResponseInnerStepsInner;
