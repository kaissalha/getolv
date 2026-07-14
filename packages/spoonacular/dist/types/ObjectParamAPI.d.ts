import { HttpFile, HttpInfo } from '../http/http';
import { Configuration } from '../configuration';
import { AddMealPlanTemplate200Response } from '../models/AddMealPlanTemplate200Response';
import { AddToMealPlanRequest } from '../models/AddToMealPlanRequest';
import { AddToShoppingListRequest } from '../models/AddToShoppingListRequest';
import { AnalyzeARecipeSearchQuery200Response } from '../models/AnalyzeARecipeSearchQuery200Response';
import { AnalyzeRecipeInstructions200Response } from '../models/AnalyzeRecipeInstructions200Response';
import { AnalyzeRecipeRequest } from '../models/AnalyzeRecipeRequest';
import { AutocompleteIngredientSearch200ResponseInner } from '../models/AutocompleteIngredientSearch200ResponseInner';
import { AutocompleteProductSearch200Response } from '../models/AutocompleteProductSearch200Response';
import { AutocompleteRecipeSearch200ResponseInner } from '../models/AutocompleteRecipeSearch200ResponseInner';
import { ClassifyCuisine200Response } from '../models/ClassifyCuisine200Response';
import { ClassifyGroceryProduct200Response } from '../models/ClassifyGroceryProduct200Response';
import { ClassifyGroceryProductBulk200ResponseInner } from '../models/ClassifyGroceryProductBulk200ResponseInner';
import { ClassifyGroceryProductBulkRequestInner } from '../models/ClassifyGroceryProductBulkRequestInner';
import { ClassifyGroceryProductRequest } from '../models/ClassifyGroceryProductRequest';
import { ComputeGlycemicLoad200Response } from '../models/ComputeGlycemicLoad200Response';
import { ComputeGlycemicLoadRequest } from '../models/ComputeGlycemicLoadRequest';
import { ComputeIngredientAmount200Response } from '../models/ComputeIngredientAmount200Response';
import { ConnectUser200Response } from '../models/ConnectUser200Response';
import { ConnectUserRequest } from '../models/ConnectUserRequest';
import { ConvertAmounts200Response } from '../models/ConvertAmounts200Response';
import { CreateRecipeCard200Response } from '../models/CreateRecipeCard200Response';
import { DetectFoodInText200Response } from '../models/DetectFoodInText200Response';
import { GenerateMealPlan200Response } from '../models/GenerateMealPlan200Response';
import { GetARandomFoodJoke200Response } from '../models/GetARandomFoodJoke200Response';
import { GetAnalyzedRecipeInstructions200ResponseInner } from '../models/GetAnalyzedRecipeInstructions200ResponseInner';
import { GetComparableProducts200Response } from '../models/GetComparableProducts200Response';
import { GetConversationSuggests200Response } from '../models/GetConversationSuggests200Response';
import { GetDishPairingForWine200Response } from '../models/GetDishPairingForWine200Response';
import { GetIngredientSubstitutes200Response } from '../models/GetIngredientSubstitutes200Response';
import { GetMealPlanTemplate200Response } from '../models/GetMealPlanTemplate200Response';
import { GetMealPlanTemplates200Response } from '../models/GetMealPlanTemplates200Response';
import { GetMealPlanWeek200Response } from '../models/GetMealPlanWeek200Response';
import { GetRandomRecipes200Response } from '../models/GetRandomRecipes200Response';
import { GetRecipeEquipmentByID200Response } from '../models/GetRecipeEquipmentByID200Response';
import { GetRecipeIngredientsByID200Response } from '../models/GetRecipeIngredientsByID200Response';
import { GetRecipeNutritionWidgetByID200Response } from '../models/GetRecipeNutritionWidgetByID200Response';
import { GetRecipePriceBreakdownByID200Response } from '../models/GetRecipePriceBreakdownByID200Response';
import { GetShoppingList200Response } from '../models/GetShoppingList200Response';
import { GetSimilarRecipes200ResponseInner } from '../models/GetSimilarRecipes200ResponseInner';
import { GetWineDescription200Response } from '../models/GetWineDescription200Response';
import { GetWinePairing200Response } from '../models/GetWinePairing200Response';
import { GetWineRecommendation200Response } from '../models/GetWineRecommendation200Response';
import { GuessNutritionByDishName200Response } from '../models/GuessNutritionByDishName200Response';
import { ImageAnalysisByURL200Response } from '../models/ImageAnalysisByURL200Response';
import { ImageClassificationByURL200Response } from '../models/ImageClassificationByURL200Response';
import { IngredientInformation } from '../models/IngredientInformation';
import { IngredientSearch200Response } from '../models/IngredientSearch200Response';
import { MapIngredientsToGroceryProducts200ResponseInner } from '../models/MapIngredientsToGroceryProducts200ResponseInner';
import { MapIngredientsToGroceryProductsRequest } from '../models/MapIngredientsToGroceryProductsRequest';
import { MenuItem } from '../models/MenuItem';
import { ProductInformation } from '../models/ProductInformation';
import { QuickAnswer200Response } from '../models/QuickAnswer200Response';
import { RecipeInformation } from '../models/RecipeInformation';
import { SearchAllFood200Response } from '../models/SearchAllFood200Response';
import { SearchCustomFoods200Response } from '../models/SearchCustomFoods200Response';
import { SearchFoodVideos200Response } from '../models/SearchFoodVideos200Response';
import { SearchGroceryProducts200Response } from '../models/SearchGroceryProducts200Response';
import { SearchGroceryProductsByUPC200Response } from '../models/SearchGroceryProductsByUPC200Response';
import { SearchMenuItems200Response } from '../models/SearchMenuItems200Response';
import { SearchRecipes200Response } from '../models/SearchRecipes200Response';
import { SearchRecipesByIngredients200ResponseInner } from '../models/SearchRecipesByIngredients200ResponseInner';
import { SearchRecipesByNutrients200ResponseInner } from '../models/SearchRecipesByNutrients200ResponseInner';
import { SearchRestaurants200Response } from '../models/SearchRestaurants200Response';
import { SearchSiteContent200Response } from '../models/SearchSiteContent200Response';
import { SummarizeRecipe200Response } from '../models/SummarizeRecipe200Response';
import { TalkToChatbot200Response } from '../models/TalkToChatbot200Response';
import { TasteInformation } from '../models/TasteInformation';
import { DefaultApiRequestFactory, DefaultApiResponseProcessor } from "../apis/DefaultApi";
export interface DefaultApiAnalyzeRecipeRequest {
    analyzeRecipeRequest: AnalyzeRecipeRequest;
    language?: string;
    includeNutrition?: boolean;
    includeTaste?: boolean;
}
export interface DefaultApiCreateRecipeCardGetRequest {
    id: number;
    mask?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    fontColor?: string;
}
export interface DefaultApiSearchRestaurantsRequest {
    query?: string;
    lat?: number;
    lng?: number;
    distance?: number;
    budget?: number;
    cuisine?: string;
    minRating?: number;
    isOpen?: boolean;
    sort?: string;
    page?: number;
}
export declare class ObjectDefaultApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor);
    analyzeRecipeWithHttpInfo(param: DefaultApiAnalyzeRecipeRequest, options?: Configuration): Promise<HttpInfo<any>>;
    analyzeRecipe(param: DefaultApiAnalyzeRecipeRequest, options?: Configuration): Promise<any>;
    createRecipeCardGetWithHttpInfo(param: DefaultApiCreateRecipeCardGetRequest, options?: Configuration): Promise<HttpInfo<any>>;
    createRecipeCardGet(param: DefaultApiCreateRecipeCardGetRequest, options?: Configuration): Promise<any>;
    searchRestaurantsWithHttpInfo(param?: DefaultApiSearchRestaurantsRequest, options?: Configuration): Promise<HttpInfo<SearchRestaurants200Response>>;
    searchRestaurants(param?: DefaultApiSearchRestaurantsRequest, options?: Configuration): Promise<SearchRestaurants200Response>;
}
import { IngredientsApiRequestFactory, IngredientsApiResponseProcessor } from "../apis/IngredientsApi";
export interface IngredientsApiAutocompleteIngredientSearchRequest {
    query: string;
    number?: number;
    metaInformation?: boolean;
    intolerances?: string;
    language?: 'en' | 'de';
}
export interface IngredientsApiComputeIngredientAmountRequest {
    id: number;
    nutrient: string;
    target: number;
    unit?: string;
}
export interface IngredientsApiGetIngredientInformationRequest {
    id: number;
    amount?: number;
    unit?: string;
}
export interface IngredientsApiGetIngredientSubstitutesRequest {
    ingredientName: string;
}
export interface IngredientsApiGetIngredientSubstitutesByIDRequest {
    id: number;
}
export interface IngredientsApiIngredientSearchRequest {
    query: string;
    addChildren?: boolean;
    minProteinPercent?: number;
    maxProteinPercent?: number;
    minFatPercent?: number;
    maxFatPercent?: number;
    minCarbsPercent?: number;
    maxCarbsPercent?: number;
    metaInformation?: boolean;
    intolerances?: string;
    sort?: string;
    sortDirection?: string;
    offset?: number;
    number?: number;
    language?: 'en' | 'de';
}
export interface IngredientsApiIngredientsByIDImageRequest {
    id: number;
    measure?: 'us' | 'metric';
}
export interface IngredientsApiMapIngredientsToGroceryProductsRequest {
    mapIngredientsToGroceryProductsRequest: MapIngredientsToGroceryProductsRequest;
}
export interface IngredientsApiVisualizeIngredientsRequest {
    ingredientList: string;
    servings: number;
    language?: 'en' | 'de';
    measure?: string;
    view?: string;
    defaultCss?: boolean;
    showBacklink?: boolean;
}
export declare class ObjectIngredientsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: IngredientsApiRequestFactory, responseProcessor?: IngredientsApiResponseProcessor);
    autocompleteIngredientSearchWithHttpInfo(param: IngredientsApiAutocompleteIngredientSearchRequest, options?: Configuration): Promise<HttpInfo<Set<AutocompleteIngredientSearch200ResponseInner>>>;
    autocompleteIngredientSearch(param: IngredientsApiAutocompleteIngredientSearchRequest, options?: Configuration): Promise<Set<AutocompleteIngredientSearch200ResponseInner>>;
    computeIngredientAmountWithHttpInfo(param: IngredientsApiComputeIngredientAmountRequest, options?: Configuration): Promise<HttpInfo<ComputeIngredientAmount200Response>>;
    computeIngredientAmount(param: IngredientsApiComputeIngredientAmountRequest, options?: Configuration): Promise<ComputeIngredientAmount200Response>;
    getIngredientInformationWithHttpInfo(param: IngredientsApiGetIngredientInformationRequest, options?: Configuration): Promise<HttpInfo<IngredientInformation>>;
    getIngredientInformation(param: IngredientsApiGetIngredientInformationRequest, options?: Configuration): Promise<IngredientInformation>;
    getIngredientSubstitutesWithHttpInfo(param: IngredientsApiGetIngredientSubstitutesRequest, options?: Configuration): Promise<HttpInfo<GetIngredientSubstitutes200Response>>;
    getIngredientSubstitutes(param: IngredientsApiGetIngredientSubstitutesRequest, options?: Configuration): Promise<GetIngredientSubstitutes200Response>;
    getIngredientSubstitutesByIDWithHttpInfo(param: IngredientsApiGetIngredientSubstitutesByIDRequest, options?: Configuration): Promise<HttpInfo<GetIngredientSubstitutes200Response>>;
    getIngredientSubstitutesByID(param: IngredientsApiGetIngredientSubstitutesByIDRequest, options?: Configuration): Promise<GetIngredientSubstitutes200Response>;
    ingredientSearchWithHttpInfo(param: IngredientsApiIngredientSearchRequest, options?: Configuration): Promise<HttpInfo<IngredientSearch200Response>>;
    ingredientSearch(param: IngredientsApiIngredientSearchRequest, options?: Configuration): Promise<IngredientSearch200Response>;
    ingredientsByIDImageWithHttpInfo(param: IngredientsApiIngredientsByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    ingredientsByIDImage(param: IngredientsApiIngredientsByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    mapIngredientsToGroceryProductsWithHttpInfo(param: IngredientsApiMapIngredientsToGroceryProductsRequest, options?: Configuration): Promise<HttpInfo<Set<MapIngredientsToGroceryProducts200ResponseInner>>>;
    mapIngredientsToGroceryProducts(param: IngredientsApiMapIngredientsToGroceryProductsRequest, options?: Configuration): Promise<Set<MapIngredientsToGroceryProducts200ResponseInner>>;
    visualizeIngredientsWithHttpInfo(param: IngredientsApiVisualizeIngredientsRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeIngredients(param: IngredientsApiVisualizeIngredientsRequest, options?: Configuration): Promise<string>;
}
import { MealPlanningApiRequestFactory, MealPlanningApiResponseProcessor } from "../apis/MealPlanningApi";
export interface MealPlanningApiAddMealPlanTemplateRequest {
    username: string;
    hash: string;
}
export interface MealPlanningApiAddToMealPlanRequest {
    username: string;
    hash: string;
    addToMealPlanRequest: AddToMealPlanRequest;
}
export interface MealPlanningApiAddToShoppingListRequest {
    username: string;
    hash: string;
    addToShoppingListRequest: AddToShoppingListRequest;
}
export interface MealPlanningApiClearMealPlanDayRequest {
    username: string;
    date: string;
    hash: string;
}
export interface MealPlanningApiConnectUserRequest {
    connectUserRequest: ConnectUserRequest;
}
export interface MealPlanningApiDeleteFromMealPlanRequest {
    username: string;
    id: number;
    hash: string;
}
export interface MealPlanningApiDeleteFromShoppingListRequest {
    username: string;
    id: number;
    hash: string;
}
export interface MealPlanningApiDeleteMealPlanTemplateRequest {
    username: string;
    id: number;
    hash: string;
}
export interface MealPlanningApiGenerateMealPlanRequest {
    timeFrame?: string;
    targetCalories?: number;
    diet?: string;
    exclude?: string;
}
export interface MealPlanningApiGenerateShoppingListRequest {
    username: string;
    startDate: string;
    endDate: string;
    hash: string;
}
export interface MealPlanningApiGetMealPlanTemplateRequest {
    username: string;
    id: number;
    hash: string;
}
export interface MealPlanningApiGetMealPlanTemplatesRequest {
    username: string;
    hash: string;
}
export interface MealPlanningApiGetMealPlanWeekRequest {
    username: string;
    startDate: string;
    hash: string;
}
export interface MealPlanningApiGetShoppingListRequest {
    username: string;
    hash: string;
}
export declare class ObjectMealPlanningApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: MealPlanningApiRequestFactory, responseProcessor?: MealPlanningApiResponseProcessor);
    addMealPlanTemplateWithHttpInfo(param: MealPlanningApiAddMealPlanTemplateRequest, options?: Configuration): Promise<HttpInfo<AddMealPlanTemplate200Response>>;
    addMealPlanTemplate(param: MealPlanningApiAddMealPlanTemplateRequest, options?: Configuration): Promise<AddMealPlanTemplate200Response>;
    addToMealPlanWithHttpInfo(param: MealPlanningApiAddToMealPlanRequest, options?: Configuration): Promise<HttpInfo<any>>;
    addToMealPlan(param: MealPlanningApiAddToMealPlanRequest, options?: Configuration): Promise<any>;
    addToShoppingListWithHttpInfo(param: MealPlanningApiAddToShoppingListRequest, options?: Configuration): Promise<HttpInfo<GetShoppingList200Response>>;
    addToShoppingList(param: MealPlanningApiAddToShoppingListRequest, options?: Configuration): Promise<GetShoppingList200Response>;
    clearMealPlanDayWithHttpInfo(param: MealPlanningApiClearMealPlanDayRequest, options?: Configuration): Promise<HttpInfo<any>>;
    clearMealPlanDay(param: MealPlanningApiClearMealPlanDayRequest, options?: Configuration): Promise<any>;
    connectUserWithHttpInfo(param: MealPlanningApiConnectUserRequest, options?: Configuration): Promise<HttpInfo<ConnectUser200Response>>;
    connectUser(param: MealPlanningApiConnectUserRequest, options?: Configuration): Promise<ConnectUser200Response>;
    deleteFromMealPlanWithHttpInfo(param: MealPlanningApiDeleteFromMealPlanRequest, options?: Configuration): Promise<HttpInfo<any>>;
    deleteFromMealPlan(param: MealPlanningApiDeleteFromMealPlanRequest, options?: Configuration): Promise<any>;
    deleteFromShoppingListWithHttpInfo(param: MealPlanningApiDeleteFromShoppingListRequest, options?: Configuration): Promise<HttpInfo<any>>;
    deleteFromShoppingList(param: MealPlanningApiDeleteFromShoppingListRequest, options?: Configuration): Promise<any>;
    deleteMealPlanTemplateWithHttpInfo(param: MealPlanningApiDeleteMealPlanTemplateRequest, options?: Configuration): Promise<HttpInfo<any>>;
    deleteMealPlanTemplate(param: MealPlanningApiDeleteMealPlanTemplateRequest, options?: Configuration): Promise<any>;
    generateMealPlanWithHttpInfo(param?: MealPlanningApiGenerateMealPlanRequest, options?: Configuration): Promise<HttpInfo<GenerateMealPlan200Response>>;
    generateMealPlan(param?: MealPlanningApiGenerateMealPlanRequest, options?: Configuration): Promise<GenerateMealPlan200Response>;
    generateShoppingListWithHttpInfo(param: MealPlanningApiGenerateShoppingListRequest, options?: Configuration): Promise<HttpInfo<GetShoppingList200Response>>;
    generateShoppingList(param: MealPlanningApiGenerateShoppingListRequest, options?: Configuration): Promise<GetShoppingList200Response>;
    getMealPlanTemplateWithHttpInfo(param: MealPlanningApiGetMealPlanTemplateRequest, options?: Configuration): Promise<HttpInfo<GetMealPlanTemplate200Response>>;
    getMealPlanTemplate(param: MealPlanningApiGetMealPlanTemplateRequest, options?: Configuration): Promise<GetMealPlanTemplate200Response>;
    getMealPlanTemplatesWithHttpInfo(param: MealPlanningApiGetMealPlanTemplatesRequest, options?: Configuration): Promise<HttpInfo<GetMealPlanTemplates200Response>>;
    getMealPlanTemplates(param: MealPlanningApiGetMealPlanTemplatesRequest, options?: Configuration): Promise<GetMealPlanTemplates200Response>;
    getMealPlanWeekWithHttpInfo(param: MealPlanningApiGetMealPlanWeekRequest, options?: Configuration): Promise<HttpInfo<GetMealPlanWeek200Response>>;
    getMealPlanWeek(param: MealPlanningApiGetMealPlanWeekRequest, options?: Configuration): Promise<GetMealPlanWeek200Response>;
    getShoppingListWithHttpInfo(param: MealPlanningApiGetShoppingListRequest, options?: Configuration): Promise<HttpInfo<GetShoppingList200Response>>;
    getShoppingList(param: MealPlanningApiGetShoppingListRequest, options?: Configuration): Promise<GetShoppingList200Response>;
}
import { MenuItemsApiRequestFactory, MenuItemsApiResponseProcessor } from "../apis/MenuItemsApi";
export interface MenuItemsApiAutocompleteMenuItemSearchRequest {
    query: string;
    number?: number;
}
export interface MenuItemsApiGetMenuItemInformationRequest {
    id: number;
}
export interface MenuItemsApiMenuItemNutritionByIDImageRequest {
    id: number;
}
export interface MenuItemsApiMenuItemNutritionLabelImageRequest {
    id: number;
    showOptionalNutrients?: boolean;
    showZeroValues?: boolean;
    showIngredients?: boolean;
}
export interface MenuItemsApiMenuItemNutritionLabelWidgetRequest {
    id: number;
    defaultCss?: boolean;
    showOptionalNutrients?: boolean;
    showZeroValues?: boolean;
    showIngredients?: boolean;
}
export interface MenuItemsApiSearchMenuItemsRequest {
    query: string;
    minCalories?: number;
    maxCalories?: number;
    minCarbs?: number;
    maxCarbs?: number;
    minProtein?: number;
    maxProtein?: number;
    minFat?: number;
    maxFat?: number;
    addMenuItemInformation?: boolean;
    offset?: number;
    number?: number;
}
export interface MenuItemsApiVisualizeMenuItemNutritionByIDRequest {
    id: number;
    defaultCss?: boolean;
}
export declare class ObjectMenuItemsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: MenuItemsApiRequestFactory, responseProcessor?: MenuItemsApiResponseProcessor);
    autocompleteMenuItemSearchWithHttpInfo(param: MenuItemsApiAutocompleteMenuItemSearchRequest, options?: Configuration): Promise<HttpInfo<AutocompleteProductSearch200Response>>;
    autocompleteMenuItemSearch(param: MenuItemsApiAutocompleteMenuItemSearchRequest, options?: Configuration): Promise<AutocompleteProductSearch200Response>;
    getMenuItemInformationWithHttpInfo(param: MenuItemsApiGetMenuItemInformationRequest, options?: Configuration): Promise<HttpInfo<MenuItem>>;
    getMenuItemInformation(param: MenuItemsApiGetMenuItemInformationRequest, options?: Configuration): Promise<MenuItem>;
    menuItemNutritionByIDImageWithHttpInfo(param: MenuItemsApiMenuItemNutritionByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    menuItemNutritionByIDImage(param: MenuItemsApiMenuItemNutritionByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    menuItemNutritionLabelImageWithHttpInfo(param: MenuItemsApiMenuItemNutritionLabelImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    menuItemNutritionLabelImage(param: MenuItemsApiMenuItemNutritionLabelImageRequest, options?: Configuration): Promise<HttpFile>;
    menuItemNutritionLabelWidgetWithHttpInfo(param: MenuItemsApiMenuItemNutritionLabelWidgetRequest, options?: Configuration): Promise<HttpInfo<string>>;
    menuItemNutritionLabelWidget(param: MenuItemsApiMenuItemNutritionLabelWidgetRequest, options?: Configuration): Promise<string>;
    searchMenuItemsWithHttpInfo(param: MenuItemsApiSearchMenuItemsRequest, options?: Configuration): Promise<HttpInfo<SearchMenuItems200Response>>;
    searchMenuItems(param: MenuItemsApiSearchMenuItemsRequest, options?: Configuration): Promise<SearchMenuItems200Response>;
    visualizeMenuItemNutritionByIDWithHttpInfo(param: MenuItemsApiVisualizeMenuItemNutritionByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeMenuItemNutritionByID(param: MenuItemsApiVisualizeMenuItemNutritionByIDRequest, options?: Configuration): Promise<string>;
}
import { MiscApiRequestFactory, MiscApiResponseProcessor } from "../apis/MiscApi";
export interface MiscApiDetectFoodInTextRequest {
    text: string;
}
export interface MiscApiGetARandomFoodJokeRequest {
}
export interface MiscApiGetConversationSuggestsRequest {
    query: string;
    number?: number;
}
export interface MiscApiGetRandomFoodTriviaRequest {
}
export interface MiscApiImageAnalysisByURLRequest {
    imageUrl: string;
}
export interface MiscApiImageClassificationByURLRequest {
    imageUrl: string;
}
export interface MiscApiSearchAllFoodRequest {
    query: string;
    offset?: number;
    number?: number;
}
export interface MiscApiSearchCustomFoodsRequest {
    query: string;
    username: string;
    hash: string;
    offset?: number;
    number?: number;
}
export interface MiscApiSearchFoodVideosRequest {
    query: string;
    type?: string;
    cuisine?: string;
    diet?: string;
    includeIngredients?: string;
    excludeIngredients?: string;
    minLength?: number;
    maxLength?: number;
    offset?: number;
    number?: number;
}
export interface MiscApiSearchSiteContentRequest {
    query: string;
}
export interface MiscApiTalkToChatbotRequest {
    text: string;
    contextId?: string;
}
export declare class ObjectMiscApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: MiscApiRequestFactory, responseProcessor?: MiscApiResponseProcessor);
    detectFoodInTextWithHttpInfo(param: MiscApiDetectFoodInTextRequest, options?: Configuration): Promise<HttpInfo<DetectFoodInText200Response>>;
    detectFoodInText(param: MiscApiDetectFoodInTextRequest, options?: Configuration): Promise<DetectFoodInText200Response>;
    getARandomFoodJokeWithHttpInfo(param?: MiscApiGetARandomFoodJokeRequest, options?: Configuration): Promise<HttpInfo<GetARandomFoodJoke200Response>>;
    getARandomFoodJoke(param?: MiscApiGetARandomFoodJokeRequest, options?: Configuration): Promise<GetARandomFoodJoke200Response>;
    getConversationSuggestsWithHttpInfo(param: MiscApiGetConversationSuggestsRequest, options?: Configuration): Promise<HttpInfo<GetConversationSuggests200Response>>;
    getConversationSuggests(param: MiscApiGetConversationSuggestsRequest, options?: Configuration): Promise<GetConversationSuggests200Response>;
    getRandomFoodTriviaWithHttpInfo(param?: MiscApiGetRandomFoodTriviaRequest, options?: Configuration): Promise<HttpInfo<GetARandomFoodJoke200Response>>;
    getRandomFoodTrivia(param?: MiscApiGetRandomFoodTriviaRequest, options?: Configuration): Promise<GetARandomFoodJoke200Response>;
    imageAnalysisByURLWithHttpInfo(param: MiscApiImageAnalysisByURLRequest, options?: Configuration): Promise<HttpInfo<ImageAnalysisByURL200Response>>;
    imageAnalysisByURL(param: MiscApiImageAnalysisByURLRequest, options?: Configuration): Promise<ImageAnalysisByURL200Response>;
    imageClassificationByURLWithHttpInfo(param: MiscApiImageClassificationByURLRequest, options?: Configuration): Promise<HttpInfo<ImageClassificationByURL200Response>>;
    imageClassificationByURL(param: MiscApiImageClassificationByURLRequest, options?: Configuration): Promise<ImageClassificationByURL200Response>;
    searchAllFoodWithHttpInfo(param: MiscApiSearchAllFoodRequest, options?: Configuration): Promise<HttpInfo<SearchAllFood200Response>>;
    searchAllFood(param: MiscApiSearchAllFoodRequest, options?: Configuration): Promise<SearchAllFood200Response>;
    searchCustomFoodsWithHttpInfo(param: MiscApiSearchCustomFoodsRequest, options?: Configuration): Promise<HttpInfo<SearchCustomFoods200Response>>;
    searchCustomFoods(param: MiscApiSearchCustomFoodsRequest, options?: Configuration): Promise<SearchCustomFoods200Response>;
    searchFoodVideosWithHttpInfo(param: MiscApiSearchFoodVideosRequest, options?: Configuration): Promise<HttpInfo<SearchFoodVideos200Response>>;
    searchFoodVideos(param: MiscApiSearchFoodVideosRequest, options?: Configuration): Promise<SearchFoodVideos200Response>;
    searchSiteContentWithHttpInfo(param: MiscApiSearchSiteContentRequest, options?: Configuration): Promise<HttpInfo<SearchSiteContent200Response>>;
    searchSiteContent(param: MiscApiSearchSiteContentRequest, options?: Configuration): Promise<SearchSiteContent200Response>;
    talkToChatbotWithHttpInfo(param: MiscApiTalkToChatbotRequest, options?: Configuration): Promise<HttpInfo<TalkToChatbot200Response>>;
    talkToChatbot(param: MiscApiTalkToChatbotRequest, options?: Configuration): Promise<TalkToChatbot200Response>;
}
import { ProductsApiRequestFactory, ProductsApiResponseProcessor } from "../apis/ProductsApi";
export interface ProductsApiAutocompleteProductSearchRequest {
    query: string;
    number?: number;
}
export interface ProductsApiClassifyGroceryProductRequest {
    classifyGroceryProductRequest: ClassifyGroceryProductRequest;
    locale?: 'en_US' | 'en_GB';
}
export interface ProductsApiClassifyGroceryProductBulkRequest {
    classifyGroceryProductBulkRequestInner: Set<ClassifyGroceryProductBulkRequestInner>;
    locale?: string;
}
export interface ProductsApiGetComparableProductsRequest {
    upc: string;
}
export interface ProductsApiGetProductInformationRequest {
    id: number;
}
export interface ProductsApiProductNutritionByIDImageRequest {
    id: number;
}
export interface ProductsApiProductNutritionLabelImageRequest {
    id: number;
    showOptionalNutrients?: boolean;
    showZeroValues?: boolean;
    showIngredients?: boolean;
}
export interface ProductsApiProductNutritionLabelWidgetRequest {
    id: number;
    defaultCss?: boolean;
    showOptionalNutrients?: boolean;
    showZeroValues?: boolean;
    showIngredients?: boolean;
}
export interface ProductsApiSearchGroceryProductsRequest {
    query: string;
    minCalories?: number;
    maxCalories?: number;
    minCarbs?: number;
    maxCarbs?: number;
    minProtein?: number;
    maxProtein?: number;
    minFat?: number;
    maxFat?: number;
    addProductInformation?: boolean;
    offset?: number;
    number?: number;
}
export interface ProductsApiSearchGroceryProductsByUPCRequest {
    upc: string;
}
export interface ProductsApiVisualizeProductNutritionByIDRequest {
    id: number;
    defaultCss?: boolean;
}
export declare class ObjectProductsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: ProductsApiRequestFactory, responseProcessor?: ProductsApiResponseProcessor);
    autocompleteProductSearchWithHttpInfo(param: ProductsApiAutocompleteProductSearchRequest, options?: Configuration): Promise<HttpInfo<AutocompleteProductSearch200Response>>;
    autocompleteProductSearch(param: ProductsApiAutocompleteProductSearchRequest, options?: Configuration): Promise<AutocompleteProductSearch200Response>;
    classifyGroceryProductWithHttpInfo(param: ProductsApiClassifyGroceryProductRequest, options?: Configuration): Promise<HttpInfo<ClassifyGroceryProduct200Response>>;
    classifyGroceryProduct(param: ProductsApiClassifyGroceryProductRequest, options?: Configuration): Promise<ClassifyGroceryProduct200Response>;
    classifyGroceryProductBulkWithHttpInfo(param: ProductsApiClassifyGroceryProductBulkRequest, options?: Configuration): Promise<HttpInfo<Set<ClassifyGroceryProductBulk200ResponseInner>>>;
    classifyGroceryProductBulk(param: ProductsApiClassifyGroceryProductBulkRequest, options?: Configuration): Promise<Set<ClassifyGroceryProductBulk200ResponseInner>>;
    getComparableProductsWithHttpInfo(param: ProductsApiGetComparableProductsRequest, options?: Configuration): Promise<HttpInfo<GetComparableProducts200Response>>;
    getComparableProducts(param: ProductsApiGetComparableProductsRequest, options?: Configuration): Promise<GetComparableProducts200Response>;
    getProductInformationWithHttpInfo(param: ProductsApiGetProductInformationRequest, options?: Configuration): Promise<HttpInfo<ProductInformation>>;
    getProductInformation(param: ProductsApiGetProductInformationRequest, options?: Configuration): Promise<ProductInformation>;
    productNutritionByIDImageWithHttpInfo(param: ProductsApiProductNutritionByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    productNutritionByIDImage(param: ProductsApiProductNutritionByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    productNutritionLabelImageWithHttpInfo(param: ProductsApiProductNutritionLabelImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    productNutritionLabelImage(param: ProductsApiProductNutritionLabelImageRequest, options?: Configuration): Promise<HttpFile>;
    productNutritionLabelWidgetWithHttpInfo(param: ProductsApiProductNutritionLabelWidgetRequest, options?: Configuration): Promise<HttpInfo<string>>;
    productNutritionLabelWidget(param: ProductsApiProductNutritionLabelWidgetRequest, options?: Configuration): Promise<string>;
    searchGroceryProductsWithHttpInfo(param: ProductsApiSearchGroceryProductsRequest, options?: Configuration): Promise<HttpInfo<SearchGroceryProducts200Response>>;
    searchGroceryProducts(param: ProductsApiSearchGroceryProductsRequest, options?: Configuration): Promise<SearchGroceryProducts200Response>;
    searchGroceryProductsByUPCWithHttpInfo(param: ProductsApiSearchGroceryProductsByUPCRequest, options?: Configuration): Promise<HttpInfo<SearchGroceryProductsByUPC200Response>>;
    searchGroceryProductsByUPC(param: ProductsApiSearchGroceryProductsByUPCRequest, options?: Configuration): Promise<SearchGroceryProductsByUPC200Response>;
    visualizeProductNutritionByIDWithHttpInfo(param: ProductsApiVisualizeProductNutritionByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeProductNutritionByID(param: ProductsApiVisualizeProductNutritionByIDRequest, options?: Configuration): Promise<string>;
}
import { RecipesApiRequestFactory, RecipesApiResponseProcessor } from "../apis/RecipesApi";
export interface RecipesApiAnalyzeARecipeSearchQueryRequest {
    q: string;
}
export interface RecipesApiAnalyzeRecipeInstructionsRequest {
    instructions: string;
}
export interface RecipesApiAutocompleteRecipeSearchRequest {
    query: string;
    number?: number;
}
export interface RecipesApiClassifyCuisineRequest {
    title: string;
    ingredientList: string;
    language?: 'en' | 'de';
}
export interface RecipesApiComputeGlycemicLoadRequest {
    computeGlycemicLoadRequest: ComputeGlycemicLoadRequest;
    language?: 'en' | 'de';
}
export interface RecipesApiConvertAmountsRequest {
    ingredientName: string;
    sourceAmount: number;
    sourceUnit: string;
    targetUnit: string;
}
export interface RecipesApiCreateRecipeCardRequest {
    title: string;
    ingredients: string;
    instructions: string;
    readyInMinutes: number;
    servings: number;
    mask: string;
    backgroundImage: string;
    image?: HttpFile;
    imageUrl?: string;
    author?: string;
    backgroundColor?: string;
    fontColor?: string;
    source?: string;
}
export interface RecipesApiEquipmentByIDImageRequest {
    id: number;
}
export interface RecipesApiExtractRecipeFromWebsiteRequest {
    url: string;
    forceExtraction?: boolean;
    analyze?: boolean;
    includeNutrition?: boolean;
    includeTaste?: boolean;
}
export interface RecipesApiGetAnalyzedRecipeInstructionsRequest {
    id: number;
    stepBreakdown?: boolean;
}
export interface RecipesApiGetRandomRecipesRequest {
    includeNutrition?: boolean;
    includeTags?: string;
    excludeTags?: string;
    number?: number;
}
export interface RecipesApiGetRecipeEquipmentByIDRequest {
    id: number;
}
export interface RecipesApiGetRecipeInformationRequest {
    id: number;
    includeNutrition?: boolean;
    addWinePairing?: boolean;
    addTasteData?: boolean;
}
export interface RecipesApiGetRecipeInformationBulkRequest {
    ids: string;
    includeNutrition?: boolean;
}
export interface RecipesApiGetRecipeIngredientsByIDRequest {
    id: number;
}
export interface RecipesApiGetRecipeNutritionWidgetByIDRequest {
    id: number;
}
export interface RecipesApiGetRecipePriceBreakdownByIDRequest {
    id: number;
}
export interface RecipesApiGetRecipeTasteByIDRequest {
    id: number;
    normalize?: boolean;
}
export interface RecipesApiGetSimilarRecipesRequest {
    id: number;
    number?: number;
}
export interface RecipesApiGuessNutritionByDishNameRequest {
    title: string;
}
export interface RecipesApiParseIngredientsRequest {
    ingredientList: string;
    servings: number;
    language?: 'en' | 'de';
    includeNutrition?: boolean;
}
export interface RecipesApiPriceBreakdownByIDImageRequest {
    id: number;
}
export interface RecipesApiQuickAnswerRequest {
    q: string;
}
export interface RecipesApiRecipeNutritionByIDImageRequest {
    id: number;
}
export interface RecipesApiRecipeNutritionLabelImageRequest {
    id: number;
    showOptionalNutrients?: boolean;
    showZeroValues?: boolean;
    showIngredients?: boolean;
}
export interface RecipesApiRecipeNutritionLabelWidgetRequest {
    id: number;
    defaultCss?: boolean;
    showOptionalNutrients?: boolean;
    showZeroValues?: boolean;
    showIngredients?: boolean;
}
export interface RecipesApiRecipeTasteByIDImageRequest {
    id: number;
    normalize?: boolean;
    rgb?: string;
}
export interface RecipesApiSearchRecipesRequest {
    query: string;
    cuisine?: string;
    excludeCuisine?: string;
    diet?: string;
    intolerances?: string;
    equipment?: string;
    includeIngredients?: string;
    excludeIngredients?: string;
    type?: string;
    instructionsRequired?: boolean;
    fillIngredients?: boolean;
    addRecipeInformation?: boolean;
    addRecipeNutrition?: boolean;
    author?: string;
    tags?: string;
    recipeBoxId?: number;
    titleMatch?: string;
    maxReadyTime?: number;
    minServings?: number;
    maxServings?: number;
    ignorePantry?: boolean;
    sort?: string;
    sortDirection?: string;
    minCarbs?: number;
    maxCarbs?: number;
    minProtein?: number;
    maxProtein?: number;
    minCalories?: number;
    maxCalories?: number;
    minFat?: number;
    maxFat?: number;
    minAlcohol?: number;
    maxAlcohol?: number;
    minCaffeine?: number;
    maxCaffeine?: number;
    minCopper?: number;
    maxCopper?: number;
    minCalcium?: number;
    maxCalcium?: number;
    minCholine?: number;
    maxCholine?: number;
    minCholesterol?: number;
    maxCholesterol?: number;
    minFluoride?: number;
    maxFluoride?: number;
    minSaturatedFat?: number;
    maxSaturatedFat?: number;
    minVitaminA?: number;
    maxVitaminA?: number;
    minVitaminC?: number;
    maxVitaminC?: number;
    minVitaminD?: number;
    maxVitaminD?: number;
    minVitaminE?: number;
    maxVitaminE?: number;
    minVitaminK?: number;
    maxVitaminK?: number;
    minVitaminB1?: number;
    maxVitaminB1?: number;
    minVitaminB2?: number;
    maxVitaminB2?: number;
    minVitaminB5?: number;
    maxVitaminB5?: number;
    minVitaminB3?: number;
    maxVitaminB3?: number;
    minVitaminB6?: number;
    maxVitaminB6?: number;
    minVitaminB12?: number;
    maxVitaminB12?: number;
    minFiber?: number;
    maxFiber?: number;
    minFolate?: number;
    maxFolate?: number;
    minFolicAcid?: number;
    maxFolicAcid?: number;
    minIodine?: number;
    maxIodine?: number;
    minIron?: number;
    maxIron?: number;
    minMagnesium?: number;
    maxMagnesium?: number;
    minManganese?: number;
    maxManganese?: number;
    minPhosphorus?: number;
    maxPhosphorus?: number;
    minPotassium?: number;
    maxPotassium?: number;
    minSelenium?: number;
    maxSelenium?: number;
    minSodium?: number;
    maxSodium?: number;
    minSugar?: number;
    maxSugar?: number;
    minZinc?: number;
    maxZinc?: number;
    offset?: number;
    number?: number;
}
export interface RecipesApiSearchRecipesByIngredientsRequest {
    ingredients: string;
    number?: number;
    ranking?: number;
    ignorePantry?: boolean;
}
export interface RecipesApiSearchRecipesByNutrientsRequest {
    minCarbs?: number;
    maxCarbs?: number;
    minProtein?: number;
    maxProtein?: number;
    minCalories?: number;
    maxCalories?: number;
    minFat?: number;
    maxFat?: number;
    minAlcohol?: number;
    maxAlcohol?: number;
    minCaffeine?: number;
    maxCaffeine?: number;
    minCopper?: number;
    maxCopper?: number;
    minCalcium?: number;
    maxCalcium?: number;
    minCholine?: number;
    maxCholine?: number;
    minCholesterol?: number;
    maxCholesterol?: number;
    minFluoride?: number;
    maxFluoride?: number;
    minSaturatedFat?: number;
    maxSaturatedFat?: number;
    minVitaminA?: number;
    maxVitaminA?: number;
    minVitaminC?: number;
    maxVitaminC?: number;
    minVitaminD?: number;
    maxVitaminD?: number;
    minVitaminE?: number;
    maxVitaminE?: number;
    minVitaminK?: number;
    maxVitaminK?: number;
    minVitaminB1?: number;
    maxVitaminB1?: number;
    minVitaminB2?: number;
    maxVitaminB2?: number;
    minVitaminB5?: number;
    maxVitaminB5?: number;
    minVitaminB3?: number;
    maxVitaminB3?: number;
    minVitaminB6?: number;
    maxVitaminB6?: number;
    minVitaminB12?: number;
    maxVitaminB12?: number;
    minFiber?: number;
    maxFiber?: number;
    minFolate?: number;
    maxFolate?: number;
    minFolicAcid?: number;
    maxFolicAcid?: number;
    minIodine?: number;
    maxIodine?: number;
    minIron?: number;
    maxIron?: number;
    minMagnesium?: number;
    maxMagnesium?: number;
    minManganese?: number;
    maxManganese?: number;
    minPhosphorus?: number;
    maxPhosphorus?: number;
    minPotassium?: number;
    maxPotassium?: number;
    minSelenium?: number;
    maxSelenium?: number;
    minSodium?: number;
    maxSodium?: number;
    minSugar?: number;
    maxSugar?: number;
    minZinc?: number;
    maxZinc?: number;
    offset?: number;
    number?: number;
    random?: boolean;
}
export interface RecipesApiSummarizeRecipeRequest {
    id: number;
}
export interface RecipesApiVisualizeEquipmentRequest {
    instructions: string;
    view?: string;
    defaultCss?: boolean;
    showBacklink?: boolean;
}
export interface RecipesApiVisualizePriceBreakdownRequest {
    ingredientList: string;
    servings: number;
    language?: 'en' | 'de';
    mode?: number;
    defaultCss?: boolean;
    showBacklink?: boolean;
}
export interface RecipesApiVisualizeRecipeEquipmentByIDRequest {
    id: number;
    defaultCss?: boolean;
}
export interface RecipesApiVisualizeRecipeIngredientsByIDRequest {
    id: number;
    defaultCss?: boolean;
    measure?: 'us' | 'metric';
}
export interface RecipesApiVisualizeRecipeNutritionRequest {
    ingredientList: string;
    servings: number;
    language?: 'en' | 'de';
    defaultCss?: boolean;
    showBacklink?: boolean;
}
export interface RecipesApiVisualizeRecipeNutritionByIDRequest {
    id: number;
    defaultCss?: boolean;
}
export interface RecipesApiVisualizeRecipePriceBreakdownByIDRequest {
    id: number;
    defaultCss?: boolean;
}
export interface RecipesApiVisualizeRecipeTasteRequest {
    ingredientList: string;
    language?: 'en' | 'de';
    normalize?: boolean;
    rgb?: string;
}
export interface RecipesApiVisualizeRecipeTasteByIDRequest {
    id: number;
    normalize?: boolean;
    rgb?: string;
}
export declare class ObjectRecipesApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RecipesApiRequestFactory, responseProcessor?: RecipesApiResponseProcessor);
    analyzeARecipeSearchQueryWithHttpInfo(param: RecipesApiAnalyzeARecipeSearchQueryRequest, options?: Configuration): Promise<HttpInfo<AnalyzeARecipeSearchQuery200Response>>;
    analyzeARecipeSearchQuery(param: RecipesApiAnalyzeARecipeSearchQueryRequest, options?: Configuration): Promise<AnalyzeARecipeSearchQuery200Response>;
    analyzeRecipeInstructionsWithHttpInfo(param: RecipesApiAnalyzeRecipeInstructionsRequest, options?: Configuration): Promise<HttpInfo<AnalyzeRecipeInstructions200Response>>;
    analyzeRecipeInstructions(param: RecipesApiAnalyzeRecipeInstructionsRequest, options?: Configuration): Promise<AnalyzeRecipeInstructions200Response>;
    autocompleteRecipeSearchWithHttpInfo(param: RecipesApiAutocompleteRecipeSearchRequest, options?: Configuration): Promise<HttpInfo<Set<AutocompleteRecipeSearch200ResponseInner>>>;
    autocompleteRecipeSearch(param: RecipesApiAutocompleteRecipeSearchRequest, options?: Configuration): Promise<Set<AutocompleteRecipeSearch200ResponseInner>>;
    classifyCuisineWithHttpInfo(param: RecipesApiClassifyCuisineRequest, options?: Configuration): Promise<HttpInfo<ClassifyCuisine200Response>>;
    classifyCuisine(param: RecipesApiClassifyCuisineRequest, options?: Configuration): Promise<ClassifyCuisine200Response>;
    computeGlycemicLoadWithHttpInfo(param: RecipesApiComputeGlycemicLoadRequest, options?: Configuration): Promise<HttpInfo<ComputeGlycemicLoad200Response>>;
    computeGlycemicLoad(param: RecipesApiComputeGlycemicLoadRequest, options?: Configuration): Promise<ComputeGlycemicLoad200Response>;
    convertAmountsWithHttpInfo(param: RecipesApiConvertAmountsRequest, options?: Configuration): Promise<HttpInfo<ConvertAmounts200Response>>;
    convertAmounts(param: RecipesApiConvertAmountsRequest, options?: Configuration): Promise<ConvertAmounts200Response>;
    createRecipeCardWithHttpInfo(param: RecipesApiCreateRecipeCardRequest, options?: Configuration): Promise<HttpInfo<CreateRecipeCard200Response>>;
    createRecipeCard(param: RecipesApiCreateRecipeCardRequest, options?: Configuration): Promise<CreateRecipeCard200Response>;
    equipmentByIDImageWithHttpInfo(param: RecipesApiEquipmentByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    equipmentByIDImage(param: RecipesApiEquipmentByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    extractRecipeFromWebsiteWithHttpInfo(param: RecipesApiExtractRecipeFromWebsiteRequest, options?: Configuration): Promise<HttpInfo<RecipeInformation>>;
    extractRecipeFromWebsite(param: RecipesApiExtractRecipeFromWebsiteRequest, options?: Configuration): Promise<RecipeInformation>;
    getAnalyzedRecipeInstructionsWithHttpInfo(param: RecipesApiGetAnalyzedRecipeInstructionsRequest, options?: Configuration): Promise<HttpInfo<Array<GetAnalyzedRecipeInstructions200ResponseInner>>>;
    getAnalyzedRecipeInstructions(param: RecipesApiGetAnalyzedRecipeInstructionsRequest, options?: Configuration): Promise<Array<GetAnalyzedRecipeInstructions200ResponseInner>>;
    getRandomRecipesWithHttpInfo(param?: RecipesApiGetRandomRecipesRequest, options?: Configuration): Promise<HttpInfo<GetRandomRecipes200Response>>;
    getRandomRecipes(param?: RecipesApiGetRandomRecipesRequest, options?: Configuration): Promise<GetRandomRecipes200Response>;
    getRecipeEquipmentByIDWithHttpInfo(param: RecipesApiGetRecipeEquipmentByIDRequest, options?: Configuration): Promise<HttpInfo<GetRecipeEquipmentByID200Response>>;
    getRecipeEquipmentByID(param: RecipesApiGetRecipeEquipmentByIDRequest, options?: Configuration): Promise<GetRecipeEquipmentByID200Response>;
    getRecipeInformationWithHttpInfo(param: RecipesApiGetRecipeInformationRequest, options?: Configuration): Promise<HttpInfo<RecipeInformation>>;
    getRecipeInformation(param: RecipesApiGetRecipeInformationRequest, options?: Configuration): Promise<RecipeInformation>;
    getRecipeInformationBulkWithHttpInfo(param: RecipesApiGetRecipeInformationBulkRequest, options?: Configuration): Promise<HttpInfo<Set<RecipeInformation>>>;
    getRecipeInformationBulk(param: RecipesApiGetRecipeInformationBulkRequest, options?: Configuration): Promise<Set<RecipeInformation>>;
    getRecipeIngredientsByIDWithHttpInfo(param: RecipesApiGetRecipeIngredientsByIDRequest, options?: Configuration): Promise<HttpInfo<GetRecipeIngredientsByID200Response>>;
    getRecipeIngredientsByID(param: RecipesApiGetRecipeIngredientsByIDRequest, options?: Configuration): Promise<GetRecipeIngredientsByID200Response>;
    getRecipeNutritionWidgetByIDWithHttpInfo(param: RecipesApiGetRecipeNutritionWidgetByIDRequest, options?: Configuration): Promise<HttpInfo<GetRecipeNutritionWidgetByID200Response>>;
    getRecipeNutritionWidgetByID(param: RecipesApiGetRecipeNutritionWidgetByIDRequest, options?: Configuration): Promise<GetRecipeNutritionWidgetByID200Response>;
    getRecipePriceBreakdownByIDWithHttpInfo(param: RecipesApiGetRecipePriceBreakdownByIDRequest, options?: Configuration): Promise<HttpInfo<GetRecipePriceBreakdownByID200Response>>;
    getRecipePriceBreakdownByID(param: RecipesApiGetRecipePriceBreakdownByIDRequest, options?: Configuration): Promise<GetRecipePriceBreakdownByID200Response>;
    getRecipeTasteByIDWithHttpInfo(param: RecipesApiGetRecipeTasteByIDRequest, options?: Configuration): Promise<HttpInfo<TasteInformation>>;
    getRecipeTasteByID(param: RecipesApiGetRecipeTasteByIDRequest, options?: Configuration): Promise<TasteInformation>;
    getSimilarRecipesWithHttpInfo(param: RecipesApiGetSimilarRecipesRequest, options?: Configuration): Promise<HttpInfo<Set<GetSimilarRecipes200ResponseInner>>>;
    getSimilarRecipes(param: RecipesApiGetSimilarRecipesRequest, options?: Configuration): Promise<Set<GetSimilarRecipes200ResponseInner>>;
    guessNutritionByDishNameWithHttpInfo(param: RecipesApiGuessNutritionByDishNameRequest, options?: Configuration): Promise<HttpInfo<GuessNutritionByDishName200Response>>;
    guessNutritionByDishName(param: RecipesApiGuessNutritionByDishNameRequest, options?: Configuration): Promise<GuessNutritionByDishName200Response>;
    parseIngredientsWithHttpInfo(param: RecipesApiParseIngredientsRequest, options?: Configuration): Promise<HttpInfo<Set<IngredientInformation>>>;
    parseIngredients(param: RecipesApiParseIngredientsRequest, options?: Configuration): Promise<Set<IngredientInformation>>;
    priceBreakdownByIDImageWithHttpInfo(param: RecipesApiPriceBreakdownByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    priceBreakdownByIDImage(param: RecipesApiPriceBreakdownByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    quickAnswerWithHttpInfo(param: RecipesApiQuickAnswerRequest, options?: Configuration): Promise<HttpInfo<QuickAnswer200Response>>;
    quickAnswer(param: RecipesApiQuickAnswerRequest, options?: Configuration): Promise<QuickAnswer200Response>;
    recipeNutritionByIDImageWithHttpInfo(param: RecipesApiRecipeNutritionByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    recipeNutritionByIDImage(param: RecipesApiRecipeNutritionByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    recipeNutritionLabelImageWithHttpInfo(param: RecipesApiRecipeNutritionLabelImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    recipeNutritionLabelImage(param: RecipesApiRecipeNutritionLabelImageRequest, options?: Configuration): Promise<HttpFile>;
    recipeNutritionLabelWidgetWithHttpInfo(param: RecipesApiRecipeNutritionLabelWidgetRequest, options?: Configuration): Promise<HttpInfo<string>>;
    recipeNutritionLabelWidget(param: RecipesApiRecipeNutritionLabelWidgetRequest, options?: Configuration): Promise<string>;
    recipeTasteByIDImageWithHttpInfo(param: RecipesApiRecipeTasteByIDImageRequest, options?: Configuration): Promise<HttpInfo<HttpFile>>;
    recipeTasteByIDImage(param: RecipesApiRecipeTasteByIDImageRequest, options?: Configuration): Promise<HttpFile>;
    searchRecipesWithHttpInfo(param: RecipesApiSearchRecipesRequest, options?: Configuration): Promise<HttpInfo<SearchRecipes200Response>>;
    searchRecipes(param: RecipesApiSearchRecipesRequest, options?: Configuration): Promise<SearchRecipes200Response>;
    searchRecipesByIngredientsWithHttpInfo(param: RecipesApiSearchRecipesByIngredientsRequest, options?: Configuration): Promise<HttpInfo<Set<SearchRecipesByIngredients200ResponseInner>>>;
    searchRecipesByIngredients(param: RecipesApiSearchRecipesByIngredientsRequest, options?: Configuration): Promise<Set<SearchRecipesByIngredients200ResponseInner>>;
    searchRecipesByNutrientsWithHttpInfo(param?: RecipesApiSearchRecipesByNutrientsRequest, options?: Configuration): Promise<HttpInfo<Set<SearchRecipesByNutrients200ResponseInner>>>;
    searchRecipesByNutrients(param?: RecipesApiSearchRecipesByNutrientsRequest, options?: Configuration): Promise<Set<SearchRecipesByNutrients200ResponseInner>>;
    summarizeRecipeWithHttpInfo(param: RecipesApiSummarizeRecipeRequest, options?: Configuration): Promise<HttpInfo<SummarizeRecipe200Response>>;
    summarizeRecipe(param: RecipesApiSummarizeRecipeRequest, options?: Configuration): Promise<SummarizeRecipe200Response>;
    visualizeEquipmentWithHttpInfo(param: RecipesApiVisualizeEquipmentRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeEquipment(param: RecipesApiVisualizeEquipmentRequest, options?: Configuration): Promise<string>;
    visualizePriceBreakdownWithHttpInfo(param: RecipesApiVisualizePriceBreakdownRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizePriceBreakdown(param: RecipesApiVisualizePriceBreakdownRequest, options?: Configuration): Promise<string>;
    visualizeRecipeEquipmentByIDWithHttpInfo(param: RecipesApiVisualizeRecipeEquipmentByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipeEquipmentByID(param: RecipesApiVisualizeRecipeEquipmentByIDRequest, options?: Configuration): Promise<string>;
    visualizeRecipeIngredientsByIDWithHttpInfo(param: RecipesApiVisualizeRecipeIngredientsByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipeIngredientsByID(param: RecipesApiVisualizeRecipeIngredientsByIDRequest, options?: Configuration): Promise<string>;
    visualizeRecipeNutritionWithHttpInfo(param: RecipesApiVisualizeRecipeNutritionRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipeNutrition(param: RecipesApiVisualizeRecipeNutritionRequest, options?: Configuration): Promise<string>;
    visualizeRecipeNutritionByIDWithHttpInfo(param: RecipesApiVisualizeRecipeNutritionByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipeNutritionByID(param: RecipesApiVisualizeRecipeNutritionByIDRequest, options?: Configuration): Promise<string>;
    visualizeRecipePriceBreakdownByIDWithHttpInfo(param: RecipesApiVisualizeRecipePriceBreakdownByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipePriceBreakdownByID(param: RecipesApiVisualizeRecipePriceBreakdownByIDRequest, options?: Configuration): Promise<string>;
    visualizeRecipeTasteWithHttpInfo(param: RecipesApiVisualizeRecipeTasteRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipeTaste(param: RecipesApiVisualizeRecipeTasteRequest, options?: Configuration): Promise<string>;
    visualizeRecipeTasteByIDWithHttpInfo(param: RecipesApiVisualizeRecipeTasteByIDRequest, options?: Configuration): Promise<HttpInfo<string>>;
    visualizeRecipeTasteByID(param: RecipesApiVisualizeRecipeTasteByIDRequest, options?: Configuration): Promise<string>;
}
import { WineApiRequestFactory, WineApiResponseProcessor } from "../apis/WineApi";
export interface WineApiGetDishPairingForWineRequest {
    wine: string;
}
export interface WineApiGetWineDescriptionRequest {
    wine: string;
}
export interface WineApiGetWinePairingRequest {
    food: string;
    maxPrice?: number;
}
export interface WineApiGetWineRecommendationRequest {
    wine: string;
    maxPrice?: number;
    minRating?: number;
    number?: number;
}
export declare class ObjectWineApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: WineApiRequestFactory, responseProcessor?: WineApiResponseProcessor);
    getDishPairingForWineWithHttpInfo(param: WineApiGetDishPairingForWineRequest, options?: Configuration): Promise<HttpInfo<GetDishPairingForWine200Response>>;
    getDishPairingForWine(param: WineApiGetDishPairingForWineRequest, options?: Configuration): Promise<GetDishPairingForWine200Response>;
    getWineDescriptionWithHttpInfo(param: WineApiGetWineDescriptionRequest, options?: Configuration): Promise<HttpInfo<GetWineDescription200Response>>;
    getWineDescription(param: WineApiGetWineDescriptionRequest, options?: Configuration): Promise<GetWineDescription200Response>;
    getWinePairingWithHttpInfo(param: WineApiGetWinePairingRequest, options?: Configuration): Promise<HttpInfo<GetWinePairing200Response>>;
    getWinePairing(param: WineApiGetWinePairingRequest, options?: Configuration): Promise<GetWinePairing200Response>;
    getWineRecommendationWithHttpInfo(param: WineApiGetWineRecommendationRequest, options?: Configuration): Promise<HttpInfo<GetWineRecommendation200Response>>;
    getWineRecommendation(param: WineApiGetWineRecommendationRequest, options?: Configuration): Promise<GetWineRecommendation200Response>;
}
