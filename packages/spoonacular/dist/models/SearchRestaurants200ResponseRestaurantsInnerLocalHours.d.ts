import { SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational } from '../models/SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational';
export declare class SearchRestaurants200ResponseRestaurantsInnerLocalHours {
    'operational'?: SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational;
    'delivery'?: SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational;
    'pickup'?: SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational;
    'dineIn'?: SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational;
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
