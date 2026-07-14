"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnalyzedRecipeInstructions200ResponseInner = void 0;
var GetAnalyzedRecipeInstructions200ResponseInner = (function () {
    function GetAnalyzedRecipeInstructions200ResponseInner() {
    }
    GetAnalyzedRecipeInstructions200ResponseInner.getAttributeTypeMap = function () {
        return GetAnalyzedRecipeInstructions200ResponseInner.attributeTypeMap;
    };
    GetAnalyzedRecipeInstructions200ResponseInner.discriminator = undefined;
    GetAnalyzedRecipeInstructions200ResponseInner.attributeTypeMap = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "steps",
            "baseName": "steps",
            "type": "Set<GetAnalyzedRecipeInstructions200ResponseInnerStepsInner>",
            "format": ""
        }
    ];
    return GetAnalyzedRecipeInstructions200ResponseInner;
}());
exports.GetAnalyzedRecipeInstructions200ResponseInner = GetAnalyzedRecipeInstructions200ResponseInner;
