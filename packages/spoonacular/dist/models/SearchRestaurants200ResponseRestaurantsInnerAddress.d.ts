export declare class SearchRestaurants200ResponseRestaurantsInnerAddress {
    'streetAddr'?: string;
    'city'?: string;
    'state'?: string;
    'zipcode'?: string;
    'country'?: string;
    'lat'?: number;
    'lon'?: number;
    'streetAddr2'?: string;
    'latitude'?: number;
    'longitude'?: number;
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
