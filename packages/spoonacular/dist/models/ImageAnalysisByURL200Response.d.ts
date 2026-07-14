import { ImageAnalysisByURL200ResponseCategory } from '../models/ImageAnalysisByURL200ResponseCategory';
import { ImageAnalysisByURL200ResponseNutrition } from '../models/ImageAnalysisByURL200ResponseNutrition';
import { ImageAnalysisByURL200ResponseRecipesInner } from '../models/ImageAnalysisByURL200ResponseRecipesInner';
export declare class ImageAnalysisByURL200Response {
    'nutrition': ImageAnalysisByURL200ResponseNutrition;
    'category': ImageAnalysisByURL200ResponseCategory;
    'recipes': Set<ImageAnalysisByURL200ResponseRecipesInner>;
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
