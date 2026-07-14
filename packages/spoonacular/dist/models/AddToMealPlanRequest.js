"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToMealPlanRequest = void 0;
var AddToMealPlanRequest = (function () {
    function AddToMealPlanRequest() {
    }
    AddToMealPlanRequest.getAttributeTypeMap = function () {
        return AddToMealPlanRequest.attributeTypeMap;
    };
    AddToMealPlanRequest.discriminator = undefined;
    AddToMealPlanRequest.attributeTypeMap = [
        {
            "name": "date",
            "baseName": "date",
            "type": "number",
            "format": ""
        },
        {
            "name": "slot",
            "baseName": "slot",
            "type": "number",
            "format": ""
        },
        {
            "name": "position",
            "baseName": "position",
            "type": "number",
            "format": ""
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "string",
            "format": ""
        },
        {
            "name": "value",
            "baseName": "value",
            "type": "AddToMealPlanRequestValue",
            "format": ""
        }
    ];
    return AddToMealPlanRequest;
}());
exports.AddToMealPlanRequest = AddToMealPlanRequest;
