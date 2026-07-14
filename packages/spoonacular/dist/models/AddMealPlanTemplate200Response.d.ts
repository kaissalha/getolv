import { AddMealPlanTemplate200ResponseItemsInner } from '../models/AddMealPlanTemplate200ResponseItemsInner';
export declare class AddMealPlanTemplate200Response {
    'name': string;
    'items': Set<AddMealPlanTemplate200ResponseItemsInner>;
    'publishAsPublic': boolean;
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
