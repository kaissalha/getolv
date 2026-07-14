import { RecipeInformationExtendedIngredientsInnerMeasuresMetric } from '../models/RecipeInformationExtendedIngredientsInnerMeasuresMetric';
export declare class RecipeInformationExtendedIngredientsInnerMeasures {
    'metric': RecipeInformationExtendedIngredientsInnerMeasuresMetric;
    'us': RecipeInformationExtendedIngredientsInnerMeasuresMetric;
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
