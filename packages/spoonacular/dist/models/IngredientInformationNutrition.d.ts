import { GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal } from '../models/GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal';
import { IngredientInformationNutritionPropertiesInner } from '../models/IngredientInformationNutritionPropertiesInner';
import { SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown } from '../models/SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown';
import { SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner } from '../models/SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner';
export declare class IngredientInformationNutrition {
    'nutrients': Set<SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner>;
    'properties': Set<IngredientInformationNutritionPropertiesInner>;
    'caloricBreakdown': SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown;
    'weightPerServing': GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal;
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
