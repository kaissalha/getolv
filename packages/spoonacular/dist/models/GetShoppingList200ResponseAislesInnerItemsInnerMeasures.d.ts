import { GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal } from '../models/GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal';
export declare class GetShoppingList200ResponseAislesInnerItemsInnerMeasures {
    'original': GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal;
    'metric': GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal;
    'us': GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal;
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
