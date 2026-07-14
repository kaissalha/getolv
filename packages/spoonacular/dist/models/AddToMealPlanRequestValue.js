"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToMealPlanRequestValue = void 0;
var AddToMealPlanRequestValue = (function () {
    function AddToMealPlanRequestValue() {
    }
    AddToMealPlanRequestValue.getAttributeTypeMap = function () {
        return AddToMealPlanRequestValue.attributeTypeMap;
    };
    AddToMealPlanRequestValue.discriminator = undefined;
    AddToMealPlanRequestValue.attributeTypeMap = [
        {
            "name": "ingredients",
            "baseName": "ingredients",
            "type": "Set<AddToMealPlanRequestValueIngredientsInner>",
            "format": ""
        }
    ];
    return AddToMealPlanRequestValue;
}());
exports.AddToMealPlanRequestValue = AddToMealPlanRequestValue;
