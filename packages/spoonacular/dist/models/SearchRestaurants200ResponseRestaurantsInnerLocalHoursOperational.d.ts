export declare class SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational {
    'monday'?: string;
    'tuesday'?: string;
    'wednesday'?: string;
    'thursday'?: string;
    'friday'?: string;
    'saturday'?: string;
    'sunday'?: string;
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
