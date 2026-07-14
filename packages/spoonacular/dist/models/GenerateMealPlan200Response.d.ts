import { GenerateMealPlan200ResponseNutrients } from '../models/GenerateMealPlan200ResponseNutrients';
import { GetSimilarRecipes200ResponseInner } from '../models/GetSimilarRecipes200ResponseInner';
export declare class GenerateMealPlan200Response {
    'meals': Set<GetSimilarRecipes200ResponseInner>;
    'nutrients': GenerateMealPlan200ResponseNutrients;
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
