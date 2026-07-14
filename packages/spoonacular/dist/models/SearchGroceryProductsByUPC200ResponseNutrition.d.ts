import { SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown } from '../models/SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown';
import { SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner } from '../models/SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner';
export declare class SearchGroceryProductsByUPC200ResponseNutrition {
    'nutrients': Set<SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner>;
    'caloricBreakdown': SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown;
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
