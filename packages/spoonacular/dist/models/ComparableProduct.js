"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparableProduct = void 0;
var ComparableProduct = (function () {
    function ComparableProduct() {
    }
    ComparableProduct.getAttributeTypeMap = function () {
        return ComparableProduct.attributeTypeMap;
    };
    ComparableProduct.discriminator = undefined;
    ComparableProduct.attributeTypeMap = [
        {
            "name": "difference",
            "baseName": "difference",
            "type": "number",
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
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        }
    ];
    return ComparableProduct;
}());
exports.ComparableProduct = ComparableProduct;
