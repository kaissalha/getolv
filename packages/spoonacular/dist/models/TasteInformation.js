"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasteInformation = void 0;
var TasteInformation = (function () {
    function TasteInformation() {
    }
    TasteInformation.getAttributeTypeMap = function () {
        return TasteInformation.attributeTypeMap;
    };
    TasteInformation.discriminator = undefined;
    TasteInformation.attributeTypeMap = [
        {
            "name": "sweetness",
            "baseName": "sweetness",
            "type": "number",
            "format": ""
        },
        {
            "name": "saltiness",
            "baseName": "saltiness",
            "type": "number",
            "format": ""
        },
        {
            "name": "sourness",
            "baseName": "sourness",
            "type": "number",
            "format": ""
        },
        {
            "name": "bitterness",
            "baseName": "bitterness",
            "type": "number",
            "format": ""
        },
        {
            "name": "savoriness",
            "baseName": "savoriness",
            "type": "number",
            "format": ""
        },
        {
            "name": "fattiness",
            "baseName": "fattiness",
            "type": "number",
            "format": ""
        },
        {
            "name": "spiciness",
            "baseName": "spiciness",
            "type": "number",
            "format": ""
        }
    ];
    return TasteInformation;
}());
exports.TasteInformation = TasteInformation;
