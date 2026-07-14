"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectWineApi = exports.ObjectRecipesApi = exports.ObjectProductsApi = exports.ObjectMiscApi = exports.ObjectMenuItemsApi = exports.ObjectMealPlanningApi = exports.ObjectIngredientsApi = exports.ObjectDefaultApi = void 0;
var ObservableAPI_1 = require("./ObservableAPI");
var ObjectDefaultApi = (function () {
    function ObjectDefaultApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }
    ObjectDefaultApi.prototype.analyzeRecipeWithHttpInfo = function (param, options) {
        return this.api.analyzeRecipeWithHttpInfo(param.analyzeRecipeRequest, param.language, param.includeNutrition, param.includeTaste, options).toPromise();
    };
    ObjectDefaultApi.prototype.analyzeRecipe = function (param, options) {
        return this.api.analyzeRecipe(param.analyzeRecipeRequest, param.language, param.includeNutrition, param.includeTaste, options).toPromise();
    };
    ObjectDefaultApi.prototype.createRecipeCardGetWithHttpInfo = function (param, options) {
        return this.api.createRecipeCardGetWithHttpInfo(param.id, param.mask, param.backgroundImage, param.backgroundColor, param.fontColor, options).toPromise();
    };
    ObjectDefaultApi.prototype.createRecipeCardGet = function (param, options) {
        return this.api.createRecipeCardGet(param.id, param.mask, param.backgroundImage, param.backgroundColor, param.fontColor, options).toPromise();
    };
    ObjectDefaultApi.prototype.searchRestaurantsWithHttpInfo = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.searchRestaurantsWithHttpInfo(param.query, param.lat, param.lng, param.distance, param.budget, param.cuisine, param.minRating, param.isOpen, param.sort, param.page, options).toPromise();
    };
    ObjectDefaultApi.prototype.searchRestaurants = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.searchRestaurants(param.query, param.lat, param.lng, param.distance, param.budget, param.cuisine, param.minRating, param.isOpen, param.sort, param.page, options).toPromise();
    };
    return ObjectDefaultApi;
}());
exports.ObjectDefaultApi = ObjectDefaultApi;
var ObservableAPI_2 = require("./ObservableAPI");
var ObjectIngredientsApi = (function () {
    function ObjectIngredientsApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableIngredientsApi(configuration, requestFactory, responseProcessor);
    }
    ObjectIngredientsApi.prototype.autocompleteIngredientSearchWithHttpInfo = function (param, options) {
        return this.api.autocompleteIngredientSearchWithHttpInfo(param.query, param.number, param.metaInformation, param.intolerances, param.language, options).toPromise();
    };
    ObjectIngredientsApi.prototype.autocompleteIngredientSearch = function (param, options) {
        return this.api.autocompleteIngredientSearch(param.query, param.number, param.metaInformation, param.intolerances, param.language, options).toPromise();
    };
    ObjectIngredientsApi.prototype.computeIngredientAmountWithHttpInfo = function (param, options) {
        return this.api.computeIngredientAmountWithHttpInfo(param.id, param.nutrient, param.target, param.unit, options).toPromise();
    };
    ObjectIngredientsApi.prototype.computeIngredientAmount = function (param, options) {
        return this.api.computeIngredientAmount(param.id, param.nutrient, param.target, param.unit, options).toPromise();
    };
    ObjectIngredientsApi.prototype.getIngredientInformationWithHttpInfo = function (param, options) {
        return this.api.getIngredientInformationWithHttpInfo(param.id, param.amount, param.unit, options).toPromise();
    };
    ObjectIngredientsApi.prototype.getIngredientInformation = function (param, options) {
        return this.api.getIngredientInformation(param.id, param.amount, param.unit, options).toPromise();
    };
    ObjectIngredientsApi.prototype.getIngredientSubstitutesWithHttpInfo = function (param, options) {
        return this.api.getIngredientSubstitutesWithHttpInfo(param.ingredientName, options).toPromise();
    };
    ObjectIngredientsApi.prototype.getIngredientSubstitutes = function (param, options) {
        return this.api.getIngredientSubstitutes(param.ingredientName, options).toPromise();
    };
    ObjectIngredientsApi.prototype.getIngredientSubstitutesByIDWithHttpInfo = function (param, options) {
        return this.api.getIngredientSubstitutesByIDWithHttpInfo(param.id, options).toPromise();
    };
    ObjectIngredientsApi.prototype.getIngredientSubstitutesByID = function (param, options) {
        return this.api.getIngredientSubstitutesByID(param.id, options).toPromise();
    };
    ObjectIngredientsApi.prototype.ingredientSearchWithHttpInfo = function (param, options) {
        return this.api.ingredientSearchWithHttpInfo(param.query, param.addChildren, param.minProteinPercent, param.maxProteinPercent, param.minFatPercent, param.maxFatPercent, param.minCarbsPercent, param.maxCarbsPercent, param.metaInformation, param.intolerances, param.sort, param.sortDirection, param.offset, param.number, param.language, options).toPromise();
    };
    ObjectIngredientsApi.prototype.ingredientSearch = function (param, options) {
        return this.api.ingredientSearch(param.query, param.addChildren, param.minProteinPercent, param.maxProteinPercent, param.minFatPercent, param.maxFatPercent, param.minCarbsPercent, param.maxCarbsPercent, param.metaInformation, param.intolerances, param.sort, param.sortDirection, param.offset, param.number, param.language, options).toPromise();
    };
    ObjectIngredientsApi.prototype.ingredientsByIDImageWithHttpInfo = function (param, options) {
        return this.api.ingredientsByIDImageWithHttpInfo(param.id, param.measure, options).toPromise();
    };
    ObjectIngredientsApi.prototype.ingredientsByIDImage = function (param, options) {
        return this.api.ingredientsByIDImage(param.id, param.measure, options).toPromise();
    };
    ObjectIngredientsApi.prototype.mapIngredientsToGroceryProductsWithHttpInfo = function (param, options) {
        return this.api.mapIngredientsToGroceryProductsWithHttpInfo(param.mapIngredientsToGroceryProductsRequest, options).toPromise();
    };
    ObjectIngredientsApi.prototype.mapIngredientsToGroceryProducts = function (param, options) {
        return this.api.mapIngredientsToGroceryProducts(param.mapIngredientsToGroceryProductsRequest, options).toPromise();
    };
    ObjectIngredientsApi.prototype.visualizeIngredientsWithHttpInfo = function (param, options) {
        return this.api.visualizeIngredientsWithHttpInfo(param.ingredientList, param.servings, param.language, param.measure, param.view, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectIngredientsApi.prototype.visualizeIngredients = function (param, options) {
        return this.api.visualizeIngredients(param.ingredientList, param.servings, param.language, param.measure, param.view, param.defaultCss, param.showBacklink, options).toPromise();
    };
    return ObjectIngredientsApi;
}());
exports.ObjectIngredientsApi = ObjectIngredientsApi;
var ObservableAPI_3 = require("./ObservableAPI");
var ObjectMealPlanningApi = (function () {
    function ObjectMealPlanningApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableMealPlanningApi(configuration, requestFactory, responseProcessor);
    }
    ObjectMealPlanningApi.prototype.addMealPlanTemplateWithHttpInfo = function (param, options) {
        return this.api.addMealPlanTemplateWithHttpInfo(param.username, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.addMealPlanTemplate = function (param, options) {
        return this.api.addMealPlanTemplate(param.username, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.addToMealPlanWithHttpInfo = function (param, options) {
        return this.api.addToMealPlanWithHttpInfo(param.username, param.hash, param.addToMealPlanRequest, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.addToMealPlan = function (param, options) {
        return this.api.addToMealPlan(param.username, param.hash, param.addToMealPlanRequest, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.addToShoppingListWithHttpInfo = function (param, options) {
        return this.api.addToShoppingListWithHttpInfo(param.username, param.hash, param.addToShoppingListRequest, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.addToShoppingList = function (param, options) {
        return this.api.addToShoppingList(param.username, param.hash, param.addToShoppingListRequest, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.clearMealPlanDayWithHttpInfo = function (param, options) {
        return this.api.clearMealPlanDayWithHttpInfo(param.username, param.date, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.clearMealPlanDay = function (param, options) {
        return this.api.clearMealPlanDay(param.username, param.date, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.connectUserWithHttpInfo = function (param, options) {
        return this.api.connectUserWithHttpInfo(param.connectUserRequest, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.connectUser = function (param, options) {
        return this.api.connectUser(param.connectUserRequest, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.deleteFromMealPlanWithHttpInfo = function (param, options) {
        return this.api.deleteFromMealPlanWithHttpInfo(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.deleteFromMealPlan = function (param, options) {
        return this.api.deleteFromMealPlan(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.deleteFromShoppingListWithHttpInfo = function (param, options) {
        return this.api.deleteFromShoppingListWithHttpInfo(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.deleteFromShoppingList = function (param, options) {
        return this.api.deleteFromShoppingList(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.deleteMealPlanTemplateWithHttpInfo = function (param, options) {
        return this.api.deleteMealPlanTemplateWithHttpInfo(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.deleteMealPlanTemplate = function (param, options) {
        return this.api.deleteMealPlanTemplate(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.generateMealPlanWithHttpInfo = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.generateMealPlanWithHttpInfo(param.timeFrame, param.targetCalories, param.diet, param.exclude, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.generateMealPlan = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.generateMealPlan(param.timeFrame, param.targetCalories, param.diet, param.exclude, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.generateShoppingListWithHttpInfo = function (param, options) {
        return this.api.generateShoppingListWithHttpInfo(param.username, param.startDate, param.endDate, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.generateShoppingList = function (param, options) {
        return this.api.generateShoppingList(param.username, param.startDate, param.endDate, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getMealPlanTemplateWithHttpInfo = function (param, options) {
        return this.api.getMealPlanTemplateWithHttpInfo(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getMealPlanTemplate = function (param, options) {
        return this.api.getMealPlanTemplate(param.username, param.id, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getMealPlanTemplatesWithHttpInfo = function (param, options) {
        return this.api.getMealPlanTemplatesWithHttpInfo(param.username, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getMealPlanTemplates = function (param, options) {
        return this.api.getMealPlanTemplates(param.username, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getMealPlanWeekWithHttpInfo = function (param, options) {
        return this.api.getMealPlanWeekWithHttpInfo(param.username, param.startDate, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getMealPlanWeek = function (param, options) {
        return this.api.getMealPlanWeek(param.username, param.startDate, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getShoppingListWithHttpInfo = function (param, options) {
        return this.api.getShoppingListWithHttpInfo(param.username, param.hash, options).toPromise();
    };
    ObjectMealPlanningApi.prototype.getShoppingList = function (param, options) {
        return this.api.getShoppingList(param.username, param.hash, options).toPromise();
    };
    return ObjectMealPlanningApi;
}());
exports.ObjectMealPlanningApi = ObjectMealPlanningApi;
var ObservableAPI_4 = require("./ObservableAPI");
var ObjectMenuItemsApi = (function () {
    function ObjectMenuItemsApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableMenuItemsApi(configuration, requestFactory, responseProcessor);
    }
    ObjectMenuItemsApi.prototype.autocompleteMenuItemSearchWithHttpInfo = function (param, options) {
        return this.api.autocompleteMenuItemSearchWithHttpInfo(param.query, param.number, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.autocompleteMenuItemSearch = function (param, options) {
        return this.api.autocompleteMenuItemSearch(param.query, param.number, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.getMenuItemInformationWithHttpInfo = function (param, options) {
        return this.api.getMenuItemInformationWithHttpInfo(param.id, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.getMenuItemInformation = function (param, options) {
        return this.api.getMenuItemInformation(param.id, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.menuItemNutritionByIDImageWithHttpInfo = function (param, options) {
        return this.api.menuItemNutritionByIDImageWithHttpInfo(param.id, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.menuItemNutritionByIDImage = function (param, options) {
        return this.api.menuItemNutritionByIDImage(param.id, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.menuItemNutritionLabelImageWithHttpInfo = function (param, options) {
        return this.api.menuItemNutritionLabelImageWithHttpInfo(param.id, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.menuItemNutritionLabelImage = function (param, options) {
        return this.api.menuItemNutritionLabelImage(param.id, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.menuItemNutritionLabelWidgetWithHttpInfo = function (param, options) {
        return this.api.menuItemNutritionLabelWidgetWithHttpInfo(param.id, param.defaultCss, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.menuItemNutritionLabelWidget = function (param, options) {
        return this.api.menuItemNutritionLabelWidget(param.id, param.defaultCss, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.searchMenuItemsWithHttpInfo = function (param, options) {
        return this.api.searchMenuItemsWithHttpInfo(param.query, param.minCalories, param.maxCalories, param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minFat, param.maxFat, param.addMenuItemInformation, param.offset, param.number, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.searchMenuItems = function (param, options) {
        return this.api.searchMenuItems(param.query, param.minCalories, param.maxCalories, param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minFat, param.maxFat, param.addMenuItemInformation, param.offset, param.number, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.visualizeMenuItemNutritionByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeMenuItemNutritionByIDWithHttpInfo(param.id, param.defaultCss, options).toPromise();
    };
    ObjectMenuItemsApi.prototype.visualizeMenuItemNutritionByID = function (param, options) {
        return this.api.visualizeMenuItemNutritionByID(param.id, param.defaultCss, options).toPromise();
    };
    return ObjectMenuItemsApi;
}());
exports.ObjectMenuItemsApi = ObjectMenuItemsApi;
var ObservableAPI_5 = require("./ObservableAPI");
var ObjectMiscApi = (function () {
    function ObjectMiscApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_5.ObservableMiscApi(configuration, requestFactory, responseProcessor);
    }
    ObjectMiscApi.prototype.detectFoodInTextWithHttpInfo = function (param, options) {
        return this.api.detectFoodInTextWithHttpInfo(param.text, options).toPromise();
    };
    ObjectMiscApi.prototype.detectFoodInText = function (param, options) {
        return this.api.detectFoodInText(param.text, options).toPromise();
    };
    ObjectMiscApi.prototype.getARandomFoodJokeWithHttpInfo = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.getARandomFoodJokeWithHttpInfo(options).toPromise();
    };
    ObjectMiscApi.prototype.getARandomFoodJoke = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.getARandomFoodJoke(options).toPromise();
    };
    ObjectMiscApi.prototype.getConversationSuggestsWithHttpInfo = function (param, options) {
        return this.api.getConversationSuggestsWithHttpInfo(param.query, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.getConversationSuggests = function (param, options) {
        return this.api.getConversationSuggests(param.query, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.getRandomFoodTriviaWithHttpInfo = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.getRandomFoodTriviaWithHttpInfo(options).toPromise();
    };
    ObjectMiscApi.prototype.getRandomFoodTrivia = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.getRandomFoodTrivia(options).toPromise();
    };
    ObjectMiscApi.prototype.imageAnalysisByURLWithHttpInfo = function (param, options) {
        return this.api.imageAnalysisByURLWithHttpInfo(param.imageUrl, options).toPromise();
    };
    ObjectMiscApi.prototype.imageAnalysisByURL = function (param, options) {
        return this.api.imageAnalysisByURL(param.imageUrl, options).toPromise();
    };
    ObjectMiscApi.prototype.imageClassificationByURLWithHttpInfo = function (param, options) {
        return this.api.imageClassificationByURLWithHttpInfo(param.imageUrl, options).toPromise();
    };
    ObjectMiscApi.prototype.imageClassificationByURL = function (param, options) {
        return this.api.imageClassificationByURL(param.imageUrl, options).toPromise();
    };
    ObjectMiscApi.prototype.searchAllFoodWithHttpInfo = function (param, options) {
        return this.api.searchAllFoodWithHttpInfo(param.query, param.offset, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.searchAllFood = function (param, options) {
        return this.api.searchAllFood(param.query, param.offset, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.searchCustomFoodsWithHttpInfo = function (param, options) {
        return this.api.searchCustomFoodsWithHttpInfo(param.query, param.username, param.hash, param.offset, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.searchCustomFoods = function (param, options) {
        return this.api.searchCustomFoods(param.query, param.username, param.hash, param.offset, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.searchFoodVideosWithHttpInfo = function (param, options) {
        return this.api.searchFoodVideosWithHttpInfo(param.query, param.type, param.cuisine, param.diet, param.includeIngredients, param.excludeIngredients, param.minLength, param.maxLength, param.offset, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.searchFoodVideos = function (param, options) {
        return this.api.searchFoodVideos(param.query, param.type, param.cuisine, param.diet, param.includeIngredients, param.excludeIngredients, param.minLength, param.maxLength, param.offset, param.number, options).toPromise();
    };
    ObjectMiscApi.prototype.searchSiteContentWithHttpInfo = function (param, options) {
        return this.api.searchSiteContentWithHttpInfo(param.query, options).toPromise();
    };
    ObjectMiscApi.prototype.searchSiteContent = function (param, options) {
        return this.api.searchSiteContent(param.query, options).toPromise();
    };
    ObjectMiscApi.prototype.talkToChatbotWithHttpInfo = function (param, options) {
        return this.api.talkToChatbotWithHttpInfo(param.text, param.contextId, options).toPromise();
    };
    ObjectMiscApi.prototype.talkToChatbot = function (param, options) {
        return this.api.talkToChatbot(param.text, param.contextId, options).toPromise();
    };
    return ObjectMiscApi;
}());
exports.ObjectMiscApi = ObjectMiscApi;
var ObservableAPI_6 = require("./ObservableAPI");
var ObjectProductsApi = (function () {
    function ObjectProductsApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_6.ObservableProductsApi(configuration, requestFactory, responseProcessor);
    }
    ObjectProductsApi.prototype.autocompleteProductSearchWithHttpInfo = function (param, options) {
        return this.api.autocompleteProductSearchWithHttpInfo(param.query, param.number, options).toPromise();
    };
    ObjectProductsApi.prototype.autocompleteProductSearch = function (param, options) {
        return this.api.autocompleteProductSearch(param.query, param.number, options).toPromise();
    };
    ObjectProductsApi.prototype.classifyGroceryProductWithHttpInfo = function (param, options) {
        return this.api.classifyGroceryProductWithHttpInfo(param.classifyGroceryProductRequest, param.locale, options).toPromise();
    };
    ObjectProductsApi.prototype.classifyGroceryProduct = function (param, options) {
        return this.api.classifyGroceryProduct(param.classifyGroceryProductRequest, param.locale, options).toPromise();
    };
    ObjectProductsApi.prototype.classifyGroceryProductBulkWithHttpInfo = function (param, options) {
        return this.api.classifyGroceryProductBulkWithHttpInfo(param.classifyGroceryProductBulkRequestInner, param.locale, options).toPromise();
    };
    ObjectProductsApi.prototype.classifyGroceryProductBulk = function (param, options) {
        return this.api.classifyGroceryProductBulk(param.classifyGroceryProductBulkRequestInner, param.locale, options).toPromise();
    };
    ObjectProductsApi.prototype.getComparableProductsWithHttpInfo = function (param, options) {
        return this.api.getComparableProductsWithHttpInfo(param.upc, options).toPromise();
    };
    ObjectProductsApi.prototype.getComparableProducts = function (param, options) {
        return this.api.getComparableProducts(param.upc, options).toPromise();
    };
    ObjectProductsApi.prototype.getProductInformationWithHttpInfo = function (param, options) {
        return this.api.getProductInformationWithHttpInfo(param.id, options).toPromise();
    };
    ObjectProductsApi.prototype.getProductInformation = function (param, options) {
        return this.api.getProductInformation(param.id, options).toPromise();
    };
    ObjectProductsApi.prototype.productNutritionByIDImageWithHttpInfo = function (param, options) {
        return this.api.productNutritionByIDImageWithHttpInfo(param.id, options).toPromise();
    };
    ObjectProductsApi.prototype.productNutritionByIDImage = function (param, options) {
        return this.api.productNutritionByIDImage(param.id, options).toPromise();
    };
    ObjectProductsApi.prototype.productNutritionLabelImageWithHttpInfo = function (param, options) {
        return this.api.productNutritionLabelImageWithHttpInfo(param.id, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectProductsApi.prototype.productNutritionLabelImage = function (param, options) {
        return this.api.productNutritionLabelImage(param.id, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectProductsApi.prototype.productNutritionLabelWidgetWithHttpInfo = function (param, options) {
        return this.api.productNutritionLabelWidgetWithHttpInfo(param.id, param.defaultCss, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectProductsApi.prototype.productNutritionLabelWidget = function (param, options) {
        return this.api.productNutritionLabelWidget(param.id, param.defaultCss, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectProductsApi.prototype.searchGroceryProductsWithHttpInfo = function (param, options) {
        return this.api.searchGroceryProductsWithHttpInfo(param.query, param.minCalories, param.maxCalories, param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minFat, param.maxFat, param.addProductInformation, param.offset, param.number, options).toPromise();
    };
    ObjectProductsApi.prototype.searchGroceryProducts = function (param, options) {
        return this.api.searchGroceryProducts(param.query, param.minCalories, param.maxCalories, param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minFat, param.maxFat, param.addProductInformation, param.offset, param.number, options).toPromise();
    };
    ObjectProductsApi.prototype.searchGroceryProductsByUPCWithHttpInfo = function (param, options) {
        return this.api.searchGroceryProductsByUPCWithHttpInfo(param.upc, options).toPromise();
    };
    ObjectProductsApi.prototype.searchGroceryProductsByUPC = function (param, options) {
        return this.api.searchGroceryProductsByUPC(param.upc, options).toPromise();
    };
    ObjectProductsApi.prototype.visualizeProductNutritionByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeProductNutritionByIDWithHttpInfo(param.id, param.defaultCss, options).toPromise();
    };
    ObjectProductsApi.prototype.visualizeProductNutritionByID = function (param, options) {
        return this.api.visualizeProductNutritionByID(param.id, param.defaultCss, options).toPromise();
    };
    return ObjectProductsApi;
}());
exports.ObjectProductsApi = ObjectProductsApi;
var ObservableAPI_7 = require("./ObservableAPI");
var ObjectRecipesApi = (function () {
    function ObjectRecipesApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_7.ObservableRecipesApi(configuration, requestFactory, responseProcessor);
    }
    ObjectRecipesApi.prototype.analyzeARecipeSearchQueryWithHttpInfo = function (param, options) {
        return this.api.analyzeARecipeSearchQueryWithHttpInfo(param.q, options).toPromise();
    };
    ObjectRecipesApi.prototype.analyzeARecipeSearchQuery = function (param, options) {
        return this.api.analyzeARecipeSearchQuery(param.q, options).toPromise();
    };
    ObjectRecipesApi.prototype.analyzeRecipeInstructionsWithHttpInfo = function (param, options) {
        return this.api.analyzeRecipeInstructionsWithHttpInfo(param.instructions, options).toPromise();
    };
    ObjectRecipesApi.prototype.analyzeRecipeInstructions = function (param, options) {
        return this.api.analyzeRecipeInstructions(param.instructions, options).toPromise();
    };
    ObjectRecipesApi.prototype.autocompleteRecipeSearchWithHttpInfo = function (param, options) {
        return this.api.autocompleteRecipeSearchWithHttpInfo(param.query, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.autocompleteRecipeSearch = function (param, options) {
        return this.api.autocompleteRecipeSearch(param.query, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.classifyCuisineWithHttpInfo = function (param, options) {
        return this.api.classifyCuisineWithHttpInfo(param.title, param.ingredientList, param.language, options).toPromise();
    };
    ObjectRecipesApi.prototype.classifyCuisine = function (param, options) {
        return this.api.classifyCuisine(param.title, param.ingredientList, param.language, options).toPromise();
    };
    ObjectRecipesApi.prototype.computeGlycemicLoadWithHttpInfo = function (param, options) {
        return this.api.computeGlycemicLoadWithHttpInfo(param.computeGlycemicLoadRequest, param.language, options).toPromise();
    };
    ObjectRecipesApi.prototype.computeGlycemicLoad = function (param, options) {
        return this.api.computeGlycemicLoad(param.computeGlycemicLoadRequest, param.language, options).toPromise();
    };
    ObjectRecipesApi.prototype.convertAmountsWithHttpInfo = function (param, options) {
        return this.api.convertAmountsWithHttpInfo(param.ingredientName, param.sourceAmount, param.sourceUnit, param.targetUnit, options).toPromise();
    };
    ObjectRecipesApi.prototype.convertAmounts = function (param, options) {
        return this.api.convertAmounts(param.ingredientName, param.sourceAmount, param.sourceUnit, param.targetUnit, options).toPromise();
    };
    ObjectRecipesApi.prototype.createRecipeCardWithHttpInfo = function (param, options) {
        return this.api.createRecipeCardWithHttpInfo(param.title, param.ingredients, param.instructions, param.readyInMinutes, param.servings, param.mask, param.backgroundImage, param.image, param.imageUrl, param.author, param.backgroundColor, param.fontColor, param.source, options).toPromise();
    };
    ObjectRecipesApi.prototype.createRecipeCard = function (param, options) {
        return this.api.createRecipeCard(param.title, param.ingredients, param.instructions, param.readyInMinutes, param.servings, param.mask, param.backgroundImage, param.image, param.imageUrl, param.author, param.backgroundColor, param.fontColor, param.source, options).toPromise();
    };
    ObjectRecipesApi.prototype.equipmentByIDImageWithHttpInfo = function (param, options) {
        return this.api.equipmentByIDImageWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.equipmentByIDImage = function (param, options) {
        return this.api.equipmentByIDImage(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.extractRecipeFromWebsiteWithHttpInfo = function (param, options) {
        return this.api.extractRecipeFromWebsiteWithHttpInfo(param.url, param.forceExtraction, param.analyze, param.includeNutrition, param.includeTaste, options).toPromise();
    };
    ObjectRecipesApi.prototype.extractRecipeFromWebsite = function (param, options) {
        return this.api.extractRecipeFromWebsite(param.url, param.forceExtraction, param.analyze, param.includeNutrition, param.includeTaste, options).toPromise();
    };
    ObjectRecipesApi.prototype.getAnalyzedRecipeInstructionsWithHttpInfo = function (param, options) {
        return this.api.getAnalyzedRecipeInstructionsWithHttpInfo(param.id, param.stepBreakdown, options).toPromise();
    };
    ObjectRecipesApi.prototype.getAnalyzedRecipeInstructions = function (param, options) {
        return this.api.getAnalyzedRecipeInstructions(param.id, param.stepBreakdown, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRandomRecipesWithHttpInfo = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.getRandomRecipesWithHttpInfo(param.includeNutrition, param.includeTags, param.excludeTags, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRandomRecipes = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.getRandomRecipes(param.includeNutrition, param.includeTags, param.excludeTags, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeEquipmentByIDWithHttpInfo = function (param, options) {
        return this.api.getRecipeEquipmentByIDWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeEquipmentByID = function (param, options) {
        return this.api.getRecipeEquipmentByID(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeInformationWithHttpInfo = function (param, options) {
        return this.api.getRecipeInformationWithHttpInfo(param.id, param.includeNutrition, param.addWinePairing, param.addTasteData, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeInformation = function (param, options) {
        return this.api.getRecipeInformation(param.id, param.includeNutrition, param.addWinePairing, param.addTasteData, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeInformationBulkWithHttpInfo = function (param, options) {
        return this.api.getRecipeInformationBulkWithHttpInfo(param.ids, param.includeNutrition, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeInformationBulk = function (param, options) {
        return this.api.getRecipeInformationBulk(param.ids, param.includeNutrition, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeIngredientsByIDWithHttpInfo = function (param, options) {
        return this.api.getRecipeIngredientsByIDWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeIngredientsByID = function (param, options) {
        return this.api.getRecipeIngredientsByID(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeNutritionWidgetByIDWithHttpInfo = function (param, options) {
        return this.api.getRecipeNutritionWidgetByIDWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeNutritionWidgetByID = function (param, options) {
        return this.api.getRecipeNutritionWidgetByID(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipePriceBreakdownByIDWithHttpInfo = function (param, options) {
        return this.api.getRecipePriceBreakdownByIDWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipePriceBreakdownByID = function (param, options) {
        return this.api.getRecipePriceBreakdownByID(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeTasteByIDWithHttpInfo = function (param, options) {
        return this.api.getRecipeTasteByIDWithHttpInfo(param.id, param.normalize, options).toPromise();
    };
    ObjectRecipesApi.prototype.getRecipeTasteByID = function (param, options) {
        return this.api.getRecipeTasteByID(param.id, param.normalize, options).toPromise();
    };
    ObjectRecipesApi.prototype.getSimilarRecipesWithHttpInfo = function (param, options) {
        return this.api.getSimilarRecipesWithHttpInfo(param.id, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.getSimilarRecipes = function (param, options) {
        return this.api.getSimilarRecipes(param.id, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.guessNutritionByDishNameWithHttpInfo = function (param, options) {
        return this.api.guessNutritionByDishNameWithHttpInfo(param.title, options).toPromise();
    };
    ObjectRecipesApi.prototype.guessNutritionByDishName = function (param, options) {
        return this.api.guessNutritionByDishName(param.title, options).toPromise();
    };
    ObjectRecipesApi.prototype.parseIngredientsWithHttpInfo = function (param, options) {
        return this.api.parseIngredientsWithHttpInfo(param.ingredientList, param.servings, param.language, param.includeNutrition, options).toPromise();
    };
    ObjectRecipesApi.prototype.parseIngredients = function (param, options) {
        return this.api.parseIngredients(param.ingredientList, param.servings, param.language, param.includeNutrition, options).toPromise();
    };
    ObjectRecipesApi.prototype.priceBreakdownByIDImageWithHttpInfo = function (param, options) {
        return this.api.priceBreakdownByIDImageWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.priceBreakdownByIDImage = function (param, options) {
        return this.api.priceBreakdownByIDImage(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.quickAnswerWithHttpInfo = function (param, options) {
        return this.api.quickAnswerWithHttpInfo(param.q, options).toPromise();
    };
    ObjectRecipesApi.prototype.quickAnswer = function (param, options) {
        return this.api.quickAnswer(param.q, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeNutritionByIDImageWithHttpInfo = function (param, options) {
        return this.api.recipeNutritionByIDImageWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeNutritionByIDImage = function (param, options) {
        return this.api.recipeNutritionByIDImage(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeNutritionLabelImageWithHttpInfo = function (param, options) {
        return this.api.recipeNutritionLabelImageWithHttpInfo(param.id, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeNutritionLabelImage = function (param, options) {
        return this.api.recipeNutritionLabelImage(param.id, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeNutritionLabelWidgetWithHttpInfo = function (param, options) {
        return this.api.recipeNutritionLabelWidgetWithHttpInfo(param.id, param.defaultCss, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeNutritionLabelWidget = function (param, options) {
        return this.api.recipeNutritionLabelWidget(param.id, param.defaultCss, param.showOptionalNutrients, param.showZeroValues, param.showIngredients, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeTasteByIDImageWithHttpInfo = function (param, options) {
        return this.api.recipeTasteByIDImageWithHttpInfo(param.id, param.normalize, param.rgb, options).toPromise();
    };
    ObjectRecipesApi.prototype.recipeTasteByIDImage = function (param, options) {
        return this.api.recipeTasteByIDImage(param.id, param.normalize, param.rgb, options).toPromise();
    };
    ObjectRecipesApi.prototype.searchRecipesWithHttpInfo = function (param, options) {
        return this.api.searchRecipesWithHttpInfo(param.query, param.cuisine, param.excludeCuisine, param.diet, param.intolerances, param.equipment, param.includeIngredients, param.excludeIngredients, param.type, param.instructionsRequired, param.fillIngredients, param.addRecipeInformation, param.addRecipeNutrition, param.author, param.tags, param.recipeBoxId, param.titleMatch, param.maxReadyTime, param.minServings, param.maxServings, param.ignorePantry, param.sort, param.sortDirection, param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minCalories, param.maxCalories, param.minFat, param.maxFat, param.minAlcohol, param.maxAlcohol, param.minCaffeine, param.maxCaffeine, param.minCopper, param.maxCopper, param.minCalcium, param.maxCalcium, param.minCholine, param.maxCholine, param.minCholesterol, param.maxCholesterol, param.minFluoride, param.maxFluoride, param.minSaturatedFat, param.maxSaturatedFat, param.minVitaminA, param.maxVitaminA, param.minVitaminC, param.maxVitaminC, param.minVitaminD, param.maxVitaminD, param.minVitaminE, param.maxVitaminE, param.minVitaminK, param.maxVitaminK, param.minVitaminB1, param.maxVitaminB1, param.minVitaminB2, param.maxVitaminB2, param.minVitaminB5, param.maxVitaminB5, param.minVitaminB3, param.maxVitaminB3, param.minVitaminB6, param.maxVitaminB6, param.minVitaminB12, param.maxVitaminB12, param.minFiber, param.maxFiber, param.minFolate, param.maxFolate, param.minFolicAcid, param.maxFolicAcid, param.minIodine, param.maxIodine, param.minIron, param.maxIron, param.minMagnesium, param.maxMagnesium, param.minManganese, param.maxManganese, param.minPhosphorus, param.maxPhosphorus, param.minPotassium, param.maxPotassium, param.minSelenium, param.maxSelenium, param.minSodium, param.maxSodium, param.minSugar, param.maxSugar, param.minZinc, param.maxZinc, param.offset, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.searchRecipes = function (param, options) {
        return this.api.searchRecipes(param.query, param.cuisine, param.excludeCuisine, param.diet, param.intolerances, param.equipment, param.includeIngredients, param.excludeIngredients, param.type, param.instructionsRequired, param.fillIngredients, param.addRecipeInformation, param.addRecipeNutrition, param.author, param.tags, param.recipeBoxId, param.titleMatch, param.maxReadyTime, param.minServings, param.maxServings, param.ignorePantry, param.sort, param.sortDirection, param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minCalories, param.maxCalories, param.minFat, param.maxFat, param.minAlcohol, param.maxAlcohol, param.minCaffeine, param.maxCaffeine, param.minCopper, param.maxCopper, param.minCalcium, param.maxCalcium, param.minCholine, param.maxCholine, param.minCholesterol, param.maxCholesterol, param.minFluoride, param.maxFluoride, param.minSaturatedFat, param.maxSaturatedFat, param.minVitaminA, param.maxVitaminA, param.minVitaminC, param.maxVitaminC, param.minVitaminD, param.maxVitaminD, param.minVitaminE, param.maxVitaminE, param.minVitaminK, param.maxVitaminK, param.minVitaminB1, param.maxVitaminB1, param.minVitaminB2, param.maxVitaminB2, param.minVitaminB5, param.maxVitaminB5, param.minVitaminB3, param.maxVitaminB3, param.minVitaminB6, param.maxVitaminB6, param.minVitaminB12, param.maxVitaminB12, param.minFiber, param.maxFiber, param.minFolate, param.maxFolate, param.minFolicAcid, param.maxFolicAcid, param.minIodine, param.maxIodine, param.minIron, param.maxIron, param.minMagnesium, param.maxMagnesium, param.minManganese, param.maxManganese, param.minPhosphorus, param.maxPhosphorus, param.minPotassium, param.maxPotassium, param.minSelenium, param.maxSelenium, param.minSodium, param.maxSodium, param.minSugar, param.maxSugar, param.minZinc, param.maxZinc, param.offset, param.number, options).toPromise();
    };
    ObjectRecipesApi.prototype.searchRecipesByIngredientsWithHttpInfo = function (param, options) {
        return this.api.searchRecipesByIngredientsWithHttpInfo(param.ingredients, param.number, param.ranking, param.ignorePantry, options).toPromise();
    };
    ObjectRecipesApi.prototype.searchRecipesByIngredients = function (param, options) {
        return this.api.searchRecipesByIngredients(param.ingredients, param.number, param.ranking, param.ignorePantry, options).toPromise();
    };
    ObjectRecipesApi.prototype.searchRecipesByNutrientsWithHttpInfo = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.searchRecipesByNutrientsWithHttpInfo(param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minCalories, param.maxCalories, param.minFat, param.maxFat, param.minAlcohol, param.maxAlcohol, param.minCaffeine, param.maxCaffeine, param.minCopper, param.maxCopper, param.minCalcium, param.maxCalcium, param.minCholine, param.maxCholine, param.minCholesterol, param.maxCholesterol, param.minFluoride, param.maxFluoride, param.minSaturatedFat, param.maxSaturatedFat, param.minVitaminA, param.maxVitaminA, param.minVitaminC, param.maxVitaminC, param.minVitaminD, param.maxVitaminD, param.minVitaminE, param.maxVitaminE, param.minVitaminK, param.maxVitaminK, param.minVitaminB1, param.maxVitaminB1, param.minVitaminB2, param.maxVitaminB2, param.minVitaminB5, param.maxVitaminB5, param.minVitaminB3, param.maxVitaminB3, param.minVitaminB6, param.maxVitaminB6, param.minVitaminB12, param.maxVitaminB12, param.minFiber, param.maxFiber, param.minFolate, param.maxFolate, param.minFolicAcid, param.maxFolicAcid, param.minIodine, param.maxIodine, param.minIron, param.maxIron, param.minMagnesium, param.maxMagnesium, param.minManganese, param.maxManganese, param.minPhosphorus, param.maxPhosphorus, param.minPotassium, param.maxPotassium, param.minSelenium, param.maxSelenium, param.minSodium, param.maxSodium, param.minSugar, param.maxSugar, param.minZinc, param.maxZinc, param.offset, param.number, param.random, options).toPromise();
    };
    ObjectRecipesApi.prototype.searchRecipesByNutrients = function (param, options) {
        if (param === void 0) { param = {}; }
        return this.api.searchRecipesByNutrients(param.minCarbs, param.maxCarbs, param.minProtein, param.maxProtein, param.minCalories, param.maxCalories, param.minFat, param.maxFat, param.minAlcohol, param.maxAlcohol, param.minCaffeine, param.maxCaffeine, param.minCopper, param.maxCopper, param.minCalcium, param.maxCalcium, param.minCholine, param.maxCholine, param.minCholesterol, param.maxCholesterol, param.minFluoride, param.maxFluoride, param.minSaturatedFat, param.maxSaturatedFat, param.minVitaminA, param.maxVitaminA, param.minVitaminC, param.maxVitaminC, param.minVitaminD, param.maxVitaminD, param.minVitaminE, param.maxVitaminE, param.minVitaminK, param.maxVitaminK, param.minVitaminB1, param.maxVitaminB1, param.minVitaminB2, param.maxVitaminB2, param.minVitaminB5, param.maxVitaminB5, param.minVitaminB3, param.maxVitaminB3, param.minVitaminB6, param.maxVitaminB6, param.minVitaminB12, param.maxVitaminB12, param.minFiber, param.maxFiber, param.minFolate, param.maxFolate, param.minFolicAcid, param.maxFolicAcid, param.minIodine, param.maxIodine, param.minIron, param.maxIron, param.minMagnesium, param.maxMagnesium, param.minManganese, param.maxManganese, param.minPhosphorus, param.maxPhosphorus, param.minPotassium, param.maxPotassium, param.minSelenium, param.maxSelenium, param.minSodium, param.maxSodium, param.minSugar, param.maxSugar, param.minZinc, param.maxZinc, param.offset, param.number, param.random, options).toPromise();
    };
    ObjectRecipesApi.prototype.summarizeRecipeWithHttpInfo = function (param, options) {
        return this.api.summarizeRecipeWithHttpInfo(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.summarizeRecipe = function (param, options) {
        return this.api.summarizeRecipe(param.id, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeEquipmentWithHttpInfo = function (param, options) {
        return this.api.visualizeEquipmentWithHttpInfo(param.instructions, param.view, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeEquipment = function (param, options) {
        return this.api.visualizeEquipment(param.instructions, param.view, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizePriceBreakdownWithHttpInfo = function (param, options) {
        return this.api.visualizePriceBreakdownWithHttpInfo(param.ingredientList, param.servings, param.language, param.mode, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizePriceBreakdown = function (param, options) {
        return this.api.visualizePriceBreakdown(param.ingredientList, param.servings, param.language, param.mode, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeEquipmentByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipeEquipmentByIDWithHttpInfo(param.id, param.defaultCss, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeEquipmentByID = function (param, options) {
        return this.api.visualizeRecipeEquipmentByID(param.id, param.defaultCss, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeIngredientsByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipeIngredientsByIDWithHttpInfo(param.id, param.defaultCss, param.measure, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeIngredientsByID = function (param, options) {
        return this.api.visualizeRecipeIngredientsByID(param.id, param.defaultCss, param.measure, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeNutritionWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipeNutritionWithHttpInfo(param.ingredientList, param.servings, param.language, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeNutrition = function (param, options) {
        return this.api.visualizeRecipeNutrition(param.ingredientList, param.servings, param.language, param.defaultCss, param.showBacklink, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeNutritionByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipeNutritionByIDWithHttpInfo(param.id, param.defaultCss, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeNutritionByID = function (param, options) {
        return this.api.visualizeRecipeNutritionByID(param.id, param.defaultCss, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipePriceBreakdownByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipePriceBreakdownByIDWithHttpInfo(param.id, param.defaultCss, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipePriceBreakdownByID = function (param, options) {
        return this.api.visualizeRecipePriceBreakdownByID(param.id, param.defaultCss, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeTasteWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipeTasteWithHttpInfo(param.ingredientList, param.language, param.normalize, param.rgb, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeTaste = function (param, options) {
        return this.api.visualizeRecipeTaste(param.ingredientList, param.language, param.normalize, param.rgb, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeTasteByIDWithHttpInfo = function (param, options) {
        return this.api.visualizeRecipeTasteByIDWithHttpInfo(param.id, param.normalize, param.rgb, options).toPromise();
    };
    ObjectRecipesApi.prototype.visualizeRecipeTasteByID = function (param, options) {
        return this.api.visualizeRecipeTasteByID(param.id, param.normalize, param.rgb, options).toPromise();
    };
    return ObjectRecipesApi;
}());
exports.ObjectRecipesApi = ObjectRecipesApi;
var ObservableAPI_8 = require("./ObservableAPI");
var ObjectWineApi = (function () {
    function ObjectWineApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_8.ObservableWineApi(configuration, requestFactory, responseProcessor);
    }
    ObjectWineApi.prototype.getDishPairingForWineWithHttpInfo = function (param, options) {
        return this.api.getDishPairingForWineWithHttpInfo(param.wine, options).toPromise();
    };
    ObjectWineApi.prototype.getDishPairingForWine = function (param, options) {
        return this.api.getDishPairingForWine(param.wine, options).toPromise();
    };
    ObjectWineApi.prototype.getWineDescriptionWithHttpInfo = function (param, options) {
        return this.api.getWineDescriptionWithHttpInfo(param.wine, options).toPromise();
    };
    ObjectWineApi.prototype.getWineDescription = function (param, options) {
        return this.api.getWineDescription(param.wine, options).toPromise();
    };
    ObjectWineApi.prototype.getWinePairingWithHttpInfo = function (param, options) {
        return this.api.getWinePairingWithHttpInfo(param.food, param.maxPrice, options).toPromise();
    };
    ObjectWineApi.prototype.getWinePairing = function (param, options) {
        return this.api.getWinePairing(param.food, param.maxPrice, options).toPromise();
    };
    ObjectWineApi.prototype.getWineRecommendationWithHttpInfo = function (param, options) {
        return this.api.getWineRecommendationWithHttpInfo(param.wine, param.maxPrice, param.minRating, param.number, options).toPromise();
    };
    ObjectWineApi.prototype.getWineRecommendation = function (param, options) {
        return this.api.getWineRecommendation(param.wine, param.maxPrice, param.minRating, param.number, options).toPromise();
    };
    return ObjectWineApi;
}());
exports.ObjectWineApi = ObjectWineApi;
