export declare class SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner {
    'name': string;
    'amount': number;
    'unit': string;
    'percentOfDailyNeeds': number;
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
