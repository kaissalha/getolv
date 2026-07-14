"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemServings = void 0;
var MenuItemServings = (function () {
    function MenuItemServings() {
    }
    MenuItemServings.getAttributeTypeMap = function () {
        return MenuItemServings.attributeTypeMap;
    };
    MenuItemServings.discriminator = undefined;
    MenuItemServings.attributeTypeMap = [
        {
            "name": "number",
            "baseName": "number",
            "type": "number",
            "format": ""
        },
        {
            "name": "size",
            "baseName": "size",
            "type": "number",
            "format": ""
        },
        {
            "name": "unit",
            "baseName": "unit",
            "type": "string",
            "format": ""
        }
    ];
    return MenuItemServings;
}());
exports.MenuItemServings = MenuItemServings;
