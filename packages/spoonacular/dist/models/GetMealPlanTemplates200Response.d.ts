import { GetMealPlanTemplates200ResponseTemplatesInner } from '../models/GetMealPlanTemplates200ResponseTemplatesInner';
export declare class GetMealPlanTemplates200Response {
    'templates': Set<GetMealPlanTemplates200ResponseTemplatesInner>;
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
