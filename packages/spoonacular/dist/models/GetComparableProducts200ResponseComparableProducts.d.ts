import { ComparableProduct } from '../models/ComparableProduct';
export declare class GetComparableProducts200ResponseComparableProducts {
    'calories': Array<ComparableProduct>;
    'likes': Array<ComparableProduct>;
    'price': Array<ComparableProduct>;
    'protein': Array<ComparableProduct>;
    'spoonacularScore': Array<ComparableProduct>;
    'sugar': Array<ComparableProduct>;
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
