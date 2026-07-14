import { RecipeInformationExtendedIngredientsInnerMeasures } from '../models/RecipeInformationExtendedIngredientsInnerMeasures';
export declare class RecipeInformationExtendedIngredientsInner {
    'aisle': string;
    'amount': number;
    'consistency': string;
    'id': number;
    'image': string;
    'measures'?: RecipeInformationExtendedIngredientsInnerMeasures;
    'meta'?: Array<string>;
    'name': string;
    'original': string;
    'originalName': string;
    'unit': string;
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
