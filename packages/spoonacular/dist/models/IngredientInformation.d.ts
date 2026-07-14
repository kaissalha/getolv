import { IngredientInformationEstimatedCost } from '../models/IngredientInformationEstimatedCost';
import { IngredientInformationNutrition } from '../models/IngredientInformationNutrition';
export declare class IngredientInformation {
    'id': number;
    'original': string;
    'originalName': string;
    'name': string;
    'amount': number;
    'unit': string;
    'unitShort': string;
    'unitLong': string;
    'possibleUnits': Array<string>;
    'estimatedCost': IngredientInformationEstimatedCost;
    'consistency': string;
    'shoppingListUnits'?: Array<string>;
    'aisle': string;
    'image': string;
    'meta': Array<string>;
    'nutrition'?: IngredientInformationNutrition;
    'categoryPath'?: Array<string>;
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
