import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile, HttpInfo } from '../http/http';
import { AutocompleteProductSearch200Response } from '../models/AutocompleteProductSearch200Response';
import { ClassifyGroceryProduct200Response } from '../models/ClassifyGroceryProduct200Response';
import { ClassifyGroceryProductBulk200ResponseInner } from '../models/ClassifyGroceryProductBulk200ResponseInner';
import { ClassifyGroceryProductBulkRequestInner } from '../models/ClassifyGroceryProductBulkRequestInner';
import { ClassifyGroceryProductRequest } from '../models/ClassifyGroceryProductRequest';
import { GetComparableProducts200Response } from '../models/GetComparableProducts200Response';
import { ProductInformation } from '../models/ProductInformation';
import { SearchGroceryProducts200Response } from '../models/SearchGroceryProducts200Response';
import { SearchGroceryProductsByUPC200Response } from '../models/SearchGroceryProductsByUPC200Response';
export declare class ProductsApiRequestFactory extends BaseAPIRequestFactory {
    autocompleteProductSearch(query: string, number?: number, _options?: Configuration): Promise<RequestContext>;
    classifyGroceryProduct(classifyGroceryProductRequest: ClassifyGroceryProductRequest, locale?: 'en_US' | 'en_GB', _options?: Configuration): Promise<RequestContext>;
    classifyGroceryProductBulk(classifyGroceryProductBulkRequestInner: Set<ClassifyGroceryProductBulkRequestInner>, locale?: string, _options?: Configuration): Promise<RequestContext>;
    getComparableProducts(upc: string, _options?: Configuration): Promise<RequestContext>;
    getProductInformation(id: number, _options?: Configuration): Promise<RequestContext>;
    productNutritionByIDImage(id: number, _options?: Configuration): Promise<RequestContext>;
    productNutritionLabelImage(id: number, showOptionalNutrients?: boolean, showZeroValues?: boolean, showIngredients?: boolean, _options?: Configuration): Promise<RequestContext>;
    productNutritionLabelWidget(id: number, defaultCss?: boolean, showOptionalNutrients?: boolean, showZeroValues?: boolean, showIngredients?: boolean, _options?: Configuration): Promise<RequestContext>;
    searchGroceryProducts(query: string, minCalories?: number, maxCalories?: number, minCarbs?: number, maxCarbs?: number, minProtein?: number, maxProtein?: number, minFat?: number, maxFat?: number, addProductInformation?: boolean, offset?: number, number?: number, _options?: Configuration): Promise<RequestContext>;
    searchGroceryProductsByUPC(upc: string, _options?: Configuration): Promise<RequestContext>;
    visualizeProductNutritionByID(id: number, defaultCss?: boolean, _options?: Configuration): Promise<RequestContext>;
}
export declare class ProductsApiResponseProcessor {
    autocompleteProductSearchWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AutocompleteProductSearch200Response>>;
    classifyGroceryProductWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ClassifyGroceryProduct200Response>>;
    classifyGroceryProductBulkWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Set<ClassifyGroceryProductBulk200ResponseInner>>>;
    getComparableProductsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GetComparableProducts200Response>>;
    getProductInformationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProductInformation>>;
    productNutritionByIDImageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    productNutritionLabelImageWithHttpInfo(response: ResponseContext): Promise<HttpInfo<HttpFile>>;
    productNutritionLabelWidgetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string>>;
    searchGroceryProductsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchGroceryProducts200Response>>;
    searchGroceryProductsByUPCWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SearchGroceryProductsByUPC200Response>>;
    visualizeProductNutritionByIDWithHttpInfo(response: ResponseContext): Promise<HttpInfo<string>>;
}
