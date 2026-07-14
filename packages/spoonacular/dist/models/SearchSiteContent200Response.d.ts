import { SearchResult } from '../models/SearchResult';
export declare class SearchSiteContent200Response {
    'articles': Array<SearchResult>;
    'groceryProducts': Array<SearchResult>;
    'menuItems': Array<SearchResult>;
    'recipes': Array<SearchResult>;
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
