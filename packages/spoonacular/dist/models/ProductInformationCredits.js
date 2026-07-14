"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInformationCredits = void 0;
var ProductInformationCredits = (function () {
    function ProductInformationCredits() {
    }
    ProductInformationCredits.getAttributeTypeMap = function () {
        return ProductInformationCredits.attributeTypeMap;
    };
    ProductInformationCredits.discriminator = undefined;
    ProductInformationCredits.attributeTypeMap = [
        {
            "name": "text",
            "baseName": "text",
            "type": "string",
            "format": ""
        },
        {
            "name": "link",
            "baseName": "link",
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
            "name": "imageLink",
            "baseName": "imageLink",
            "type": "string",
            "format": ""
        }
    ];
    return ProductInformationCredits;
}());
exports.ProductInformationCredits = ProductInformationCredits;
