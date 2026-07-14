import { MenuItemServings } from '../models/MenuItemServings';
import { SearchGroceryProductsByUPC200ResponseNutrition } from '../models/SearchGroceryProductsByUPC200ResponseNutrition';
export declare class MenuItem {
    'id': number;
    'title': string;
    'restaurantChain': string;
    'nutrition'?: SearchGroceryProductsByUPC200ResponseNutrition;
    'badges'?: Array<string>;
    'breadcrumbs'?: Array<string>;
    'generatedText'?: string | null;
    'imageType'?: string;
    'likes'?: number;
    'servings'?: MenuItemServings;
    'price': number | null;
    'spoonacularScore': number | null;
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
