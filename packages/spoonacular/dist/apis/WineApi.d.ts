import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { GetDishPairingForWine200Response } from '../models/GetDishPairingForWine200Response';
import { GetWineDescription200Response } from '../models/GetWineDescription200Response';
import { GetWinePairing200Response } from '../models/GetWinePairing200Response';
import { GetWineRecommendation200Response } from '../models/GetWineRecommendation200Response';
export declare class WineApiRequestFactory extends BaseAPIRequestFactory {
    getDishPairingForWine(wine: string, _options?: Configuration): Promise<RequestContext>;
    getWineDescription(wine: string, _options?: Configuration): Promise<RequestContext>;
    getWinePairing(food: string, maxPrice?: number, _options?: Configuration): Promise<RequestContext>;
    getWineRecommendation(wine: string, maxPrice?: number, minRating?: number, number?: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class WineApiResponseProcessor {
    getDishPairingForWineWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetDishPairingForWine200Response>>;
    getWineDescriptionWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetWineDescription200Response>>;
    getWinePairingWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetWinePairing200Response>>;
    getWineRecommendationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetWineRecommendation200Response>>;
}
