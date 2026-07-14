import { MenuItem } from '../models/MenuItem';
export declare class SearchMenuItems200Response {
    'menuItems': Set<MenuItem>;
    'totalMenuItems': number;
    'type': string;
    'offset': number;
    'number': number;
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
