"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInformation = void 0;
var ProductInformation = (function () {
    function ProductInformation() {
    }
    ProductInformation.getAttributeTypeMap = function () {
        return ProductInformation.attributeTypeMap;
    };
    ProductInformation.discriminator = undefined;
    ProductInformation.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        },
        {
            "name": "upc",
            "baseName": "upc",
            "type": "string",
            "format": ""
        },
        {
            "name": "usdaCode",
            "baseName": "usdaCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "breadcrumbs",
            "baseName": "breadcrumbs",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "imageType",
            "baseName": "imageType",
            "type": "string",
            "format": ""
        },
        {
            "name": "badges",
            "baseName": "badges",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "importantBadges",
            "baseName": "importantBadges",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "ingredientCount",
            "baseName": "ingredientCount",
            "type": "number",
            "format": ""
        },
        {
            "name": "generatedText",
            "baseName": "generatedText",
            "type": "string",
            "format": ""
        },
        {
            "name": "ingredientList",
            "baseName": "ingredientList",
            "type": "string",
            "format": ""
        },
        {
            "name": "ingredients",
            "baseName": "ingredients",
            "type": "Array<IngredientBasics>",
            "format": ""
        },
        {
            "name": "likes",
            "baseName": "likes",
            "type": "number",
            "format": ""
        },
        {
            "name": "aisle",
            "baseName": "aisle",
            "type": "string",
            "format": ""
        },
        {
            "name": "credits",
            "baseName": "credits",
            "type": "ProductInformationCredits",
            "format": ""
        },
        {
            "name": "nutrition",
            "baseName": "nutrition",
            "type": "SearchGroceryProductsByUPC200ResponseNutrition",
            "format": ""
        },
        {
            "name": "price",
            "baseName": "price",
            "type": "number",
            "format": ""
        },
        {
            "name": "servings",
            "baseName": "servings",
            "type": "SearchGroceryProductsByUPC200ResponseServings",
            "format": ""
        },
        {
            "name": "spoonacularScore",
            "baseName": "spoonacularScore",
            "type": "number",
            "format": ""
        }
    ];
    return ProductInformation;
}());
exports.ProductInformation = ProductInformation;
