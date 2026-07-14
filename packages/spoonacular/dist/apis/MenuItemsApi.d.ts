import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile, HttpInfo } from '../http/http';
import { AutocompleteProductSearch200Response } from '../models/AutocompleteProductSearch200Response';
import { MenuItem } from '../models/MenuItem';
import { SearchMenuItems200Response } from '../models/SearchMenuItems200Response';
export declare class MenuItemsApiRequestFactory extends BaseAPIRequestFactory {
    autocompleteMenuItemSearch(query: string, number?: number, _options?: Configuration): Promise<RequestContext>;
    getMenuItemInformation(id: number, _options?: Configuration): Promise<RequestContext>;
    menuItemNutritionByIDImage(id: number, _options?: Configuration): Promise<RequestContext>;
    menuItemNutritionLabelImage(id: number, showOptionalNutrients?: boolean, showZeroValues?: boolean, showIngredients?: boolean, _options?: Configuration): Promise<RequestContext>;
    menuItemNutritionLabelWidget(id: number, defaultCss?: boolean, showOptionalNutrients?: boolean, showZeroValues?: boolean, showIngredients?: boolean, _options?: Configuration): Promise<RequestContext>;
    searchMenuItems(query: string, minCalories?: number, maxCalories?: number, minCarbs?: number, maxCarbs?: number, minProtein?: number, maxProtein?: number, minFat?: number, maxFat?: number, addMenuItemInformation?: boolean, offset?: number, number?: number, _options?: Configuration): Promise<RequestContext>;
    visualizeMenuItemNutritionByID(id: number, defaultCss?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class MenuItemsApiResponseProcessor {
    autocompleteMenuItemSearchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AutocompleteProductSearch200Response>>;
    getMenuItemInformationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<MenuItem>>;
    menuItemNutritionByIDImageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    menuItemNutritionLabelImageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    menuItemNutritionLabelWidgetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string>>;
    searchMenuItemsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchMenuItems200Response>>;
    visualizeMenuItemNutritionByIDWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string>>;
}
