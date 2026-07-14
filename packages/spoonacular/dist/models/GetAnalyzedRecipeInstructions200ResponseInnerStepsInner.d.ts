import { GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner } from '../models/GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner';
export declare class GetAnalyzedRecipeInstructions200ResponseInnerStepsInner {
    'number': number;
    'step': string;
    'ingredients'?: Set<GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner>;
    'equipment'?: Set<GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner>;
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
