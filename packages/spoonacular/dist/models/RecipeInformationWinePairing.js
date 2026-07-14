"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInformationWinePairing = void 0;
var RecipeInformationWinePairing = (function () {
    function RecipeInformationWinePairing() {
    }
    RecipeInformationWinePairing.getAttributeTypeMap = function () {
        return RecipeInformationWinePairing.attributeTypeMap;
    };
    RecipeInformationWinePairing.discriminator = undefined;
    RecipeInformationWinePairing.attributeTypeMap = [
        {
            "name": "pairedWines",
            "baseName": "pairedWines",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "pairingText",
            "baseName": "pairingText",
            "type": "string",
            "format": ""
        },
        {
            "name": "productMatches",
            "baseName": "productMatches",
            "type": "Set<RecipeInformationWinePairingProductMatchesInner>",
            "format": ""
        }
    ];
    return RecipeInformationWinePairing;
}());
exports.RecipeInformationWinePairing = RecipeInformationWinePairing;
