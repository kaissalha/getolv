import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { DetectFoodInText200Response } from '../models/DetectFoodInText200Response';
import { GetARandomFoodJoke200Response } from '../models/GetARandomFoodJoke200Response';
import { GetConversationSuggests200Response } from '../models/GetConversationSuggests200Response';
import { ImageAnalysisByURL200Response } from '../models/ImageAnalysisByURL200Response';
import { ImageClassificationByURL200Response } from '../models/ImageClassificationByURL200Response';
import { SearchAllFood200Response } from '../models/SearchAllFood200Response';
import { SearchCustomFoods200Response } from '../models/SearchCustomFoods200Response';
import { SearchFoodVideos200Response } from '../models/SearchFoodVideos200Response';
import { SearchSiteContent200Response } from '../models/SearchSiteContent200Response';
import { TalkToChatbot200Response } from '../models/TalkToChatbot200Response';
export declare class MiscApiRequestFactory extends BaseAPIRequestFactory {
    detectFoodInText(text: string, _options?: Configuration): Promise<RequestContext>;
    getARandomFoodJoke(_options?: Configuration): Promise<RequestContext>;
    getConversationSuggests(query: string, number?: number, _options?: Configuration): Promise<RequestContext>;
    getRandomFoodTrivia(_options?: Configuration): Promise<RequestContext>;
    imageAnalysisByURL(imageUrl: string, _options?: Configuration): Promise<RequestContext>;
    imageClassificationByURL(imageUrl: string, _options?: Configuration): Promise<RequestContext>;
    searchAllFood(query: string, offset?: number, number?: number, _options?: Configuration): Promise<RequestContext>;
    searchCustomFoods(query: string, username: string, hash: string, offset?: number, number?: number, _options?: Configuration): Promise<RequestContext>;
    searchFoodVideos(query: string, type?: string, cuisine?: string, diet?: string, includeIngredients?: string, excludeIngredients?: string, minLength?: number, maxLength?: number, offset?: number, number?: number, _options?: Configuration): Promise<RequestContext>;
    searchSiteContent(query: string, _options?: Configuration): Promise<RequestContext>;
    talkToChatbot(text: string, contextId?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class MiscApiResponseProcessor {
    detectFoodInTextWithHttpInfo(response: ResponseContext): Promise<HttpInfo<DetectFoodInText200Response>>;
    getARandomFoodJokeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetARandomFoodJoke200Response>>;
    getConversationSuggestsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetConversationSuggests200Response>>;
    getRandomFoodTriviaWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetARandomFoodJoke200Response>>;
    imageAnalysisByURLWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ImageAnalysisByURL200Response>>;
    imageClassificationByURLWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ImageClassificationByURL200Response>>;
    searchAllFoodWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchAllFood200Response>>;
    searchCustomFoodsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchCustomFoods200Response>>;
    searchFoodVideosWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchFoodVideos200Response>>;
    searchSiteContentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchSiteContent200Response>>;
    talkToChatbotWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TalkToChatbot200Response>>;
}
