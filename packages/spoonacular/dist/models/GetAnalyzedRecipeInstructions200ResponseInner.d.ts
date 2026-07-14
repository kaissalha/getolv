import { GetAnalyzedRecipeInstructions200ResponseInnerStepsInner } from '../models/GetAnalyzedRecipeInstructions200ResponseInnerStepsInner';
export declare class GetAnalyzedRecipeInstructions200ResponseInner {
    'name': string;
    'steps'?: Set<GetAnalyzedRecipeInstructions200ResponseInnerStepsInner>;
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
