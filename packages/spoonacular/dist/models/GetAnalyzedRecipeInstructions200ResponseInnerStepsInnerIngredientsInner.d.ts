export declare class GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner {
    'id': number;
    'name': string;
    'localizedName': string;
    'image': string;
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
