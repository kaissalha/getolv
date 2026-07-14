import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpInfo } from '../http/http';
import { AddMealPlanTemplate200Response } from '../models/AddMealPlanTemplate200Response';
import { AddToMealPlanRequest } from '../models/AddToMealPlanRequest';
import { AddToShoppingListRequest } from '../models/AddToShoppingListRequest';
import { ConnectUser200Response } from '../models/ConnectUser200Response';
import { ConnectUserRequest } from '../models/ConnectUserRequest';
import { GenerateMealPlan200Response } from '../models/GenerateMealPlan200Response';
import { GetMealPlanTemplate200Response } from '../models/GetMealPlanTemplate200Response';
import { GetMealPlanTemplates200Response } from '../models/GetMealPlanTemplates200Response';
import { GetMealPlanWeek200Response } from '../models/GetMealPlanWeek200Response';
import { GetShoppingList200Response } from '../models/GetShoppingList200Response';
export declare class MealPlanningApiRequestFactory extends BaseAPIRequestFactory {
    addMealPlanTemplate(username: string, hash: string, _options?: Configuration): Promise<RequestContext>;
    addToMealPlan(username: string, hash: string, addToMealPlanRequest: AddToMealPlanRequest, _options?: Configuration): Promise<RequestContext>;
    addToShoppingList(username: string, hash: string, addToShoppingListRequest: AddToShoppingListRequest, _options?: Configuration): Promise<RequestContext>;
    clearMealPlanDay(username: string, date: string, hash: string, _options?: Configuration): Promise<RequestContext>;
    connectUser(connectUserRequest: ConnectUserRequest, _options?: Configuration): Promise<RequestContext>;
    deleteFromMealPlan(username: string, id: number, hash: string, _options?: Configuration): Promise<RequestContext>;
    deleteFromShoppingList(username: string, id: number, hash: string, _options?: Configuration): Promise<RequestContext>;
    deleteMealPlanTemplate(username: string, id: number, hash: string, _options?: Configuration): Promise<RequestContext>;
    generateMealPlan(timeFrame?: string, targetCalories?: number, diet?: string, exclude?: string, _options?: Configuration): Promise<RequestContext>;
    generateShoppingList(username: string, startDate: string, endDate: string, hash: string, _options?: Configuration): Promise<RequestContext>;
    getMealPlanTemplate(username: string, id: number, hash: string, _options?: Configuration): Promise<RequestContext>;
    getMealPlanTemplates(username: string, hash: string, _options?: Configuration): Promise<RequestContext>;
    getMealPlanWeek(username: string, startDate: string, hash: string, _options?: Configuration): Promise<RequestContext>;
    getShoppingList(username: string, hash: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class MealPlanningApiResponseProcessor {
    addMealPlanTemplateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AddMealPlanTemplate200Response>>;
    addToMealPlanWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    addToShoppingListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetShoppingList200Response>>;
    clearMealPlanDayWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    connectUserWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ConnectUser200Response>>;
    deleteFromMealPlanWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    deleteFromShoppingListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    deleteMealPlanTemplateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<any>>;
    generateMealPlanWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GenerateMealPlan200Response>>;
    generateShoppingListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetShoppingList200Response>>;
    getMealPlanTemplateWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetMealPlanTemplate200Response>>;
    getMealPlanTemplatesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetMealPlanTemplates200Response>>;
    getMealPlanWeekWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetMealPlanWeek200Response>>;
    getShoppingListWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetShoppingList200Response>>;
}
