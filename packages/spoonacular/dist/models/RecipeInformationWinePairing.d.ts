import { RecipeInformationWinePairingProductMatchesInner } from '../models/RecipeInformationWinePairingProductMatchesInner';
export declare class RecipeInformationWinePairing {
    'pairedWines'?: Array<string>;
    'pairingText'?: string;
    'productMatches'?: Set<RecipeInformationWinePairingProductMatchesInner>;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
        format: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
        format: string;
    }[];
    constructor();
}
