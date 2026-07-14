import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AnalyzeRecipeRequest } from '../models/AnalyzeRecipeRequest';
import { SearchRestaurants200Response } from '../models/SearchRestaurants200Response';
export declare class DefaultApiRequestFactory extends BaseAPIRequestFactory {
    analyzeRecipe(analyzeRecipeRequest: AnalyzeRecipeRequest, language?: string, includeNutrition?: boolean, includeTaste?: boolean, _options?: Configuration): Promise<RequestContext>;
    createRecipeCardGet(id: number, mask?: string, backgroundImage?: string, backgroundColor?: string, fontColor?: string, _options?: Configuration): Promise<RequestContext>;
    searchRestaurants(query?: string, lat?: number, lng?: number, distance?: number, budget?: number, cuisine?: string, minRating?: number, isOpen?: boolean, sort?: string, page?: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class DefaultApiResponseProcessor {
    analyzeRecipeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    createRecipeCardGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    searchRestaurantsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchRestaurants200Response>>;
}
