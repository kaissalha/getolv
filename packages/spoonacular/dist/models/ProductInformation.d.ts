import { IngredientBasics } from '../models/IngredientBasics';
import { ProductInformationCredits } from '../models/ProductInformationCredits';
import { SearchGroceryProductsByUPC200ResponseNutrition } from '../models/SearchGroceryProductsByUPC200ResponseNutrition';
import { SearchGroceryProductsByUPC200ResponseServings } from '../models/SearchGroceryProductsByUPC200ResponseServings';
export declare class ProductInformation {
    'id': number;
    'title': string;
    'upc'?: string | null;
    'usdaCode'?: string | null;
    'breadcrumbs': Array<string>;
    'imageType': string;
    'badges': Array<string>;
    'importantBadges': Array<string>;
    'ingredientCount': number;
    'generatedText'?: string | null;
    'ingredientList': string;
    'ingredients': Array<IngredientBasics>;
    'likes': number;
    'aisle': string | null;
    'credits'?: ProductInformationCredits;
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
