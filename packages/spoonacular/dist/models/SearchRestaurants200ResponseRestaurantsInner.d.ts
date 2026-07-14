import { SearchRestaurants200ResponseRestaurantsInnerAddress } from '../models/SearchRestaurants200ResponseRestaurantsInnerAddress';
import { SearchRestaurants200ResponseRestaurantsInnerLocalHours } from '../models/SearchRestaurants200ResponseRestaurantsInnerLocalHours';
export declare class SearchRestaurants200ResponseRestaurantsInner {
    'id'?: string;
    'name'?: string;
    'phoneNumber'?: number;
    'address'?: SearchRestaurants200ResponseRestaurantsInnerAddress;
    'type'?: string;
    'description'?: string;
    'localHours'?: SearchRestaurants200ResponseRestaurantsInnerLocalHours;
    'cuisines'?: Array<string>;
    'foodPhotos'?: Array<string>;
    'logoPhotos'?: Array<string>;
    'storePhotos'?: Array<string>;
    'dollarSigns'?: number;
    'pickupEnabled'?: boolean;
    'deliveryEnabled'?: boolean;
    'isOpen'?: boolean;
    'offersFirstPartyDelivery'?: boolean;
    'offersThirdPartyDelivery'?: boolean;
    'miles'?: number;
    'weightedRatingValue'?: number;
    'aggregatedRatingCount'?: number;
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
