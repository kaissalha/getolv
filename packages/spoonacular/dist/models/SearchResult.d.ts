export declare class SearchResult {
    'image'?: string;
    'link'?: string | null;
    'name': string;
    'type'?: string;
    'kvtable'?: string;
    'content'?: string | null;
    'id'?: number;
    'relevance'?: number;
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
