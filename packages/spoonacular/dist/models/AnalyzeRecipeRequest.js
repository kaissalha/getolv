"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeRecipeRequest = void 0;
var AnalyzeRecipeRequest = (function () {
    function AnalyzeRecipeRequest() {
    }
    AnalyzeRecipeRequest.getAttributeTypeMap = function () {
        return AnalyzeRecipeRequest.attributeTypeMap;
    };
    AnalyzeRecipeRequest.discriminator = undefined;
    AnalyzeRecipeRequest.attributeTypeMap = [
        {
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        },
        {
            "name": "servings",
            "baseName": "servings",
            "type": "number",
            "format": ""
        },
        {
            "name": "ingredients",
            "baseName": "ingredients",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "instructions",
            "baseName": "instructions",
            "type": "string",
            "format": ""
        }
    ];
    return AnalyzeRecipeRequest;
}());
exports.AnalyzeRecipeRequest = AnalyzeRecipeRequest;
