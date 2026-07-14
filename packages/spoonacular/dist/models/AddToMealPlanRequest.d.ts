import { AddToMealPlanRequestValue } from '../models/AddToMealPlanRequestValue';
export declare class AddToMealPlanRequest {
    'date': number;
    'slot': number;
    'position': number;
    'type': string;
    'value': AddToMealPlanRequestValue;
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
