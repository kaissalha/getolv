import { IngredientBasics } from '../models/IngredientBasics';
import { SearchGroceryProductsByUPC200ResponseNutrition } from '../models/SearchGroceryProductsByUPC200ResponseNutrition';
import { SearchGroceryProductsByUPC200ResponseServings } from '../models/SearchGroceryProductsByUPC200ResponseServings';
export declare class SearchGroceryProductsByUPC200Response {
    'id': number;
    'title': string;
    'badges': Array<string>;
    'importantBadges': Array<string>;
    'breadcrumbs': Array<string>;
    'generatedText': string | null;
    'imageType': string;
    'ingredientCount'?: number;
    'ingredientList': string;
    'ingredients': Array<IngredientBasics>;
    'likes': number;
    'nutrition': SearchGroceryProductsByUPC200ResponseNutrition;
    'price': number;
    'servings': SearchGroceryProductsByUPC200ResponseServings;
    'spoonacularScore': number;
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
