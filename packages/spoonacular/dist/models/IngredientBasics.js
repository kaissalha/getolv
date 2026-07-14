"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientBasics = void 0;
var IngredientBasics = (function () {
    function IngredientBasics() {
    }
    IngredientBasics.getAttributeTypeMap = function () {
        return IngredientBasics.attributeTypeMap;
    };
    IngredientBasics.discriminator = undefined;
    IngredientBasics.attributeTypeMap = [
        {
            "name": "description",
            "baseName": "description",
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
            "name": "safetyLevel",
            "baseName": "safety_level",
            "type": "string",
            "format": ""
        }
    ];
    return IngredientBasics;
}());
exports.IngredientBasics = IngredientBasics;
