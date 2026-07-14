export declare class SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown {
    'percentProtein': number;
    'percentFat': number;
    'percentCarbs': number;
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
