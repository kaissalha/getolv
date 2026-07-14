import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile, HttpInfo } from '../http/http';
import { AutocompleteIngredientSearch200ResponseInner } from '../models/AutocompleteIngredientSearch200ResponseInner';
import { ComputeIngredientAmount200Response } from '../models/ComputeIngredientAmount200Response';
import { GetIngredientSubstitutes200Response } from '../models/GetIngredientSubstitutes200Response';
import { IngredientInformation } from '../models/IngredientInformation';
import { IngredientSearch200Response } from '../models/IngredientSearch200Response';
import { MapIngredientsToGroceryProducts200ResponseInner } from '../models/MapIngredientsToGroceryProducts200ResponseInner';
import { MapIngredientsToGroceryProductsRequest } from '../models/MapIngredientsToGroceryProductsRequest';
export declare class IngredientsApiRequestFactory extends BaseAPIRequestFactory {
    autocompleteIngredientSearch(query: string, number?: number, metaInformation?: boolean, intolerances?: string, language?: 'en' | 'de', _options?: Configuration): Promise<RequestContext>;
    computeIngredientAmount(id: number, nutrient: string, target: number, unit?: string, _options?: Configuration): Promise<RequestContext>;
    getIngredientInformation(id: number, amount?: number, unit?: string, _options?: Configuration): Promise<RequestContext>;
    getIngredientSubstitutes(ingredientName: string, _options?: Configuration): Promise<RequestContext>;
    getIngredientSubstitutesByID(id: number, _options?: Configuration): Promise<RequestContext>;
    ingredientSearch(query: string, addChildren?: boolean, minProteinPercent?: number, maxProteinPercent?: number, minFatPercent?: number, maxFatPercent?: number, minCarbsPercent?: number, maxCarbsPercent?: number, metaInformation?: boolean, intolerances?: string, sort?: string, sortDirection?: string, offset?: number, number?: number, language?: 'en' | 'de', _options?: Configuration): Promise<RequestContext>;
    ingredientsByIDImage(id: number, measure?: 'us' | 'metric', _options?: Configuration): Promise<RequestContext>;
    mapIngredientsToGroceryProducts(mapIngredientsToGroceryProductsRequest: MapIngredientsToGroceryProductsRequest, _options?: Configuration): Promise<RequestContext>;
    visualizeIngredients(ingredientList: string, servings: number, language?: 'en' | 'de', measure?: string, view?: string, defaultCss?: boolean, showBacklink?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class IngredientsApiResponseProcessor {
    autocompleteIngredientSearchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Set<AutocompleteIngredientSearch200ResponseInner>>>;
    computeIngredientAmountWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ComputeIngredientAmount200Response>>;
    getIngredientInformationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<IngredientInformation>>;
    getIngredientSubstitutesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetIngredientSubstitutes200Response>>;
    getIngredientSubstitutesByIDWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetIngredientSubstitutes200Response>>;
    ingredientSearchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<IngredientSearch200Response>>;
    ingredientsByIDImageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    mapIngredientsToGroceryProductsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Set<MapIngredientsToGroceryProducts200ResponseInner>>>;
    visualizeIngredientsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string>>;
}
