import { AddToMealPlanRequestValueIngredientsInner } from '../models/AddToMealPlanRequestValueIngredientsInner';
export declare class AddToMealPlanRequestValue {
    'ingredients': Set<AddToMealPlanRequestValueIngredientsInner>;
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
