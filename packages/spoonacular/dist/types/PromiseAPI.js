"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseWineApi = exports.PromiseRecipesApi = exports.PromiseProductsApi = exports.PromiseMiscApi = exports.PromiseMenuItemsApi = exports.PromiseMealPlanningApi = exports.PromiseIngredientsApi = exports.PromiseDefaultApi = void 0;
var ObservableAPI_1 = require("./ObservableAPI");
var PromiseDefaultApi = (function () {
    function PromiseDefaultApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }
    PromiseDefaultApi.prototype.analyzeRecipeWithHttpInfo = function (analyzeRecipeRequest, language, includeNutrition, includeTaste, _options) {
        var result = this.api.analyzeRecipeWithHttpInfo(analyzeRecipeRequest, language, includeNutrition, includeTaste, _options);
        return result.toPromise();
    };
    PromiseDefaultApi.prototype.analyzeRecipe = function (analyzeRecipeRequest, language, includeNutrition, includeTaste, _options) {
        var result = this.api.analyzeRecipe(analyzeRecipeRequest, language, includeNutrition, includeTaste, _options);
        return result.toPromise();
    };
    PromiseDefaultApi.prototype.createRecipeCardGetWithHttpInfo = function (id, mask, backgroundImage, backgroundColor, fontColor, _options) {
        var result = this.api.createRecipeCardGetWithHttpInfo(id, mask, backgroundImage, backgroundColor, fontColor, _options);
        return result.toPromise();
    };
    PromiseDefaultApi.prototype.createRecipeCardGet = function (id, mask, backgroundImage, backgroundColor, fontColor, _options) {
        var result = this.api.createRecipeCardGet(id, mask, backgroundImage, backgroundColor, fontColor, _options);
        return result.toPromise();
    };
    PromiseDefaultApi.prototype.searchRestaurantsWithHttpInfo = function (query, lat, lng, distance, budget, cuisine, minRating, isOpen, sort, page, _options) {
        var result = this.api.searchRestaurantsWithHttpInfo(query, lat, lng, distance, budget, cuisine, minRating, isOpen, sort, page, _options);
        return result.toPromise();
    };
    PromiseDefaultApi.prototype.searchRestaurants = function (query, lat, lng, distance, budget, cuisine, minRating, isOpen, sort, page, _options) {
        var result = this.api.searchRestaurants(query, lat, lng, distance, budget, cuisine, minRating, isOpen, sort, page, _options);
        return result.toPromise();
    };
    return PromiseDefaultApi;
}());
exports.PromiseDefaultApi = PromiseDefaultApi;
var ObservableAPI_2 = require("./ObservableAPI");
var PromiseIngredientsApi = (function () {
    function PromiseIngredientsApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableIngredientsApi(configuration, requestFactory, responseProcessor);
    }
    PromiseIngredientsApi.prototype.autocompleteIngredientSearchWithHttpInfo = function (query, number, metaInformation, intolerances, language, _options) {
        var result = this.api.autocompleteIngredientSearchWithHttpInfo(query, number, metaInformation, intolerances, language, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.autocompleteIngredientSearch = function (query, number, metaInformation, intolerances, language, _options) {
        var result = this.api.autocompleteIngredientSearch(query, number, metaInformation, intolerances, language, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.computeIngredientAmountWithHttpInfo = function (id, nutrient, target, unit, _options) {
        var result = this.api.computeIngredientAmountWithHttpInfo(id, nutrient, target, unit, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.computeIngredientAmount = function (id, nutrient, target, unit, _options) {
        var result = this.api.computeIngredientAmount(id, nutrient, target, unit, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.getIngredientInformationWithHttpInfo = function (id, amount, unit, _options) {
        var result = this.api.getIngredientInformationWithHttpInfo(id, amount, unit, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.getIngredientInformation = function (id, amount, unit, _options) {
        var result = this.api.getIngredientInformation(id, amount, unit, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.getIngredientSubstitutesWithHttpInfo = function (ingredientName, _options) {
        var result = this.api.getIngredientSubstitutesWithHttpInfo(ingredientName, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.getIngredientSubstitutes = function (ingredientName, _options) {
        var result = this.api.getIngredientSubstitutes(ingredientName, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.getIngredientSubstitutesByIDWithHttpInfo = function (id, _options) {
        var result = this.api.getIngredientSubstitutesByIDWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.getIngredientSubstitutesByID = function (id, _options) {
        var result = this.api.getIngredientSubstitutesByID(id, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.ingredientSearchWithHttpInfo = function (query, addChildren, minProteinPercent, maxProteinPercent, minFatPercent, maxFatPercent, minCarbsPercent, maxCarbsPercent, metaInformation, intolerances, sort, sortDirection, offset, number, language, _options) {
        var result = this.api.ingredientSearchWithHttpInfo(query, addChildren, minProteinPercent, maxProteinPercent, minFatPercent, maxFatPercent, minCarbsPercent, maxCarbsPercent, metaInformation, intolerances, sort, sortDirection, offset, number, language, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.ingredientSearch = function (query, addChildren, minProteinPercent, maxProteinPercent, minFatPercent, maxFatPercent, minCarbsPercent, maxCarbsPercent, metaInformation, intolerances, sort, sortDirection, offset, number, language, _options) {
        var result = this.api.ingredientSearch(query, addChildren, minProteinPercent, maxProteinPercent, minFatPercent, maxFatPercent, minCarbsPercent, maxCarbsPercent, metaInformation, intolerances, sort, sortDirection, offset, number, language, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.ingredientsByIDImageWithHttpInfo = function (id, measure, _options) {
        var result = this.api.ingredientsByIDImageWithHttpInfo(id, measure, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.ingredientsByIDImage = function (id, measure, _options) {
        var result = this.api.ingredientsByIDImage(id, measure, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.mapIngredientsToGroceryProductsWithHttpInfo = function (mapIngredientsToGroceryProductsRequest, _options) {
        var result = this.api.mapIngredientsToGroceryProductsWithHttpInfo(mapIngredientsToGroceryProductsRequest, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.mapIngredientsToGroceryProducts = function (mapIngredientsToGroceryProductsRequest, _options) {
        var result = this.api.mapIngredientsToGroceryProducts(mapIngredientsToGroceryProductsRequest, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.visualizeIngredientsWithHttpInfo = function (ingredientList, servings, language, measure, view, defaultCss, showBacklink, _options) {
        var result = this.api.visualizeIngredientsWithHttpInfo(ingredientList, servings, language, measure, view, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseIngredientsApi.prototype.visualizeIngredients = function (ingredientList, servings, language, measure, view, defaultCss, showBacklink, _options) {
        var result = this.api.visualizeIngredients(ingredientList, servings, language, measure, view, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    return PromiseIngredientsApi;
}());
exports.PromiseIngredientsApi = PromiseIngredientsApi;
var ObservableAPI_3 = require("./ObservableAPI");
var PromiseMealPlanningApi = (function () {
    function PromiseMealPlanningApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableMealPlanningApi(configuration, requestFactory, responseProcessor);
    }
    PromiseMealPlanningApi.prototype.addMealPlanTemplateWithHttpInfo = function (username, hash, _options) {
        var result = this.api.addMealPlanTemplateWithHttpInfo(username, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.addMealPlanTemplate = function (username, hash, _options) {
        var result = this.api.addMealPlanTemplate(username, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.addToMealPlanWithHttpInfo = function (username, hash, addToMealPlanRequest, _options) {
        var result = this.api.addToMealPlanWithHttpInfo(username, hash, addToMealPlanRequest, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.addToMealPlan = function (username, hash, addToMealPlanRequest, _options) {
        var result = this.api.addToMealPlan(username, hash, addToMealPlanRequest, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.addToShoppingListWithHttpInfo = function (username, hash, addToShoppingListRequest, _options) {
        var result = this.api.addToShoppingListWithHttpInfo(username, hash, addToShoppingListRequest, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.addToShoppingList = function (username, hash, addToShoppingListRequest, _options) {
        var result = this.api.addToShoppingList(username, hash, addToShoppingListRequest, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.clearMealPlanDayWithHttpInfo = function (username, date, hash, _options) {
        var result = this.api.clearMealPlanDayWithHttpInfo(username, date, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.clearMealPlanDay = function (username, date, hash, _options) {
        var result = this.api.clearMealPlanDay(username, date, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.connectUserWithHttpInfo = function (connectUserRequest, _options) {
        var result = this.api.connectUserWithHttpInfo(connectUserRequest, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.connectUser = function (connectUserRequest, _options) {
        var result = this.api.connectUser(connectUserRequest, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.deleteFromMealPlanWithHttpInfo = function (username, id, hash, _options) {
        var result = this.api.deleteFromMealPlanWithHttpInfo(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.deleteFromMealPlan = function (username, id, hash, _options) {
        var result = this.api.deleteFromMealPlan(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.deleteFromShoppingListWithHttpInfo = function (username, id, hash, _options) {
        var result = this.api.deleteFromShoppingListWithHttpInfo(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.deleteFromShoppingList = function (username, id, hash, _options) {
        var result = this.api.deleteFromShoppingList(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.deleteMealPlanTemplateWithHttpInfo = function (username, id, hash, _options) {
        var result = this.api.deleteMealPlanTemplateWithHttpInfo(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.deleteMealPlanTemplate = function (username, id, hash, _options) {
        var result = this.api.deleteMealPlanTemplate(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.generateMealPlanWithHttpInfo = function (timeFrame, targetCalories, diet, exclude, _options) {
        var result = this.api.generateMealPlanWithHttpInfo(timeFrame, targetCalories, diet, exclude, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.generateMealPlan = function (timeFrame, targetCalories, diet, exclude, _options) {
        var result = this.api.generateMealPlan(timeFrame, targetCalories, diet, exclude, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.generateShoppingListWithHttpInfo = function (username, startDate, endDate, hash, _options) {
        var result = this.api.generateShoppingListWithHttpInfo(username, startDate, endDate, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.generateShoppingList = function (username, startDate, endDate, hash, _options) {
        var result = this.api.generateShoppingList(username, startDate, endDate, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getMealPlanTemplateWithHttpInfo = function (username, id, hash, _options) {
        var result = this.api.getMealPlanTemplateWithHttpInfo(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getMealPlanTemplate = function (username, id, hash, _options) {
        var result = this.api.getMealPlanTemplate(username, id, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getMealPlanTemplatesWithHttpInfo = function (username, hash, _options) {
        var result = this.api.getMealPlanTemplatesWithHttpInfo(username, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getMealPlanTemplates = function (username, hash, _options) {
        var result = this.api.getMealPlanTemplates(username, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getMealPlanWeekWithHttpInfo = function (username, startDate, hash, _options) {
        var result = this.api.getMealPlanWeekWithHttpInfo(username, startDate, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getMealPlanWeek = function (username, startDate, hash, _options) {
        var result = this.api.getMealPlanWeek(username, startDate, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getShoppingListWithHttpInfo = function (username, hash, _options) {
        var result = this.api.getShoppingListWithHttpInfo(username, hash, _options);
        return result.toPromise();
    };
    PromiseMealPlanningApi.prototype.getShoppingList = function (username, hash, _options) {
        var result = this.api.getShoppingList(username, hash, _options);
        return result.toPromise();
    };
    return PromiseMealPlanningApi;
}());
exports.PromiseMealPlanningApi = PromiseMealPlanningApi;
var ObservableAPI_4 = require("./ObservableAPI");
var PromiseMenuItemsApi = (function () {
    function PromiseMenuItemsApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableMenuItemsApi(configuration, requestFactory, responseProcessor);
    }
    PromiseMenuItemsApi.prototype.autocompleteMenuItemSearchWithHttpInfo = function (query, number, _options) {
        var result = this.api.autocompleteMenuItemSearchWithHttpInfo(query, number, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.autocompleteMenuItemSearch = function (query, number, _options) {
        var result = this.api.autocompleteMenuItemSearch(query, number, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.getMenuItemInformationWithHttpInfo = function (id, _options) {
        var result = this.api.getMenuItemInformationWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.getMenuItemInformation = function (id, _options) {
        var result = this.api.getMenuItemInformation(id, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.menuItemNutritionByIDImageWithHttpInfo = function (id, _options) {
        var result = this.api.menuItemNutritionByIDImageWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.menuItemNutritionByIDImage = function (id, _options) {
        var result = this.api.menuItemNutritionByIDImage(id, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.menuItemNutritionLabelImageWithHttpInfo = function (id, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.menuItemNutritionLabelImageWithHttpInfo(id, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.menuItemNutritionLabelImage = function (id, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.menuItemNutritionLabelImage(id, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.menuItemNutritionLabelWidgetWithHttpInfo = function (id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.menuItemNutritionLabelWidgetWithHttpInfo(id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.menuItemNutritionLabelWidget = function (id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.menuItemNutritionLabelWidget(id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.searchMenuItemsWithHttpInfo = function (query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addMenuItemInformation, offset, number, _options) {
        var result = this.api.searchMenuItemsWithHttpInfo(query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addMenuItemInformation, offset, number, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.searchMenuItems = function (query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addMenuItemInformation, offset, number, _options) {
        var result = this.api.searchMenuItems(query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addMenuItemInformation, offset, number, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.visualizeMenuItemNutritionByIDWithHttpInfo = function (id, defaultCss, _options) {
        var result = this.api.visualizeMenuItemNutritionByIDWithHttpInfo(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseMenuItemsApi.prototype.visualizeMenuItemNutritionByID = function (id, defaultCss, _options) {
        var result = this.api.visualizeMenuItemNutritionByID(id, defaultCss, _options);
        return result.toPromise();
    };
    return PromiseMenuItemsApi;
}());
exports.PromiseMenuItemsApi = PromiseMenuItemsApi;
var ObservableAPI_5 = require("./ObservableAPI");
var PromiseMiscApi = (function () {
    function PromiseMiscApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_5.ObservableMiscApi(configuration, requestFactory, responseProcessor);
    }
    PromiseMiscApi.prototype.detectFoodInTextWithHttpInfo = function (text, _options) {
        var result = this.api.detectFoodInTextWithHttpInfo(text, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.detectFoodInText = function (text, _options) {
        var result = this.api.detectFoodInText(text, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.getARandomFoodJokeWithHttpInfo = function (_options) {
        var result = this.api.getARandomFoodJokeWithHttpInfo(_options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.getARandomFoodJoke = function (_options) {
        var result = this.api.getARandomFoodJoke(_options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.getConversationSuggestsWithHttpInfo = function (query, number, _options) {
        var result = this.api.getConversationSuggestsWithHttpInfo(query, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.getConversationSuggests = function (query, number, _options) {
        var result = this.api.getConversationSuggests(query, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.getRandomFoodTriviaWithHttpInfo = function (_options) {
        var result = this.api.getRandomFoodTriviaWithHttpInfo(_options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.getRandomFoodTrivia = function (_options) {
        var result = this.api.getRandomFoodTrivia(_options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.imageAnalysisByURLWithHttpInfo = function (imageUrl, _options) {
        var result = this.api.imageAnalysisByURLWithHttpInfo(imageUrl, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.imageAnalysisByURL = function (imageUrl, _options) {
        var result = this.api.imageAnalysisByURL(imageUrl, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.imageClassificationByURLWithHttpInfo = function (imageUrl, _options) {
        var result = this.api.imageClassificationByURLWithHttpInfo(imageUrl, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.imageClassificationByURL = function (imageUrl, _options) {
        var result = this.api.imageClassificationByURL(imageUrl, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchAllFoodWithHttpInfo = function (query, offset, number, _options) {
        var result = this.api.searchAllFoodWithHttpInfo(query, offset, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchAllFood = function (query, offset, number, _options) {
        var result = this.api.searchAllFood(query, offset, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchCustomFoodsWithHttpInfo = function (query, username, hash, offset, number, _options) {
        var result = this.api.searchCustomFoodsWithHttpInfo(query, username, hash, offset, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchCustomFoods = function (query, username, hash, offset, number, _options) {
        var result = this.api.searchCustomFoods(query, username, hash, offset, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchFoodVideosWithHttpInfo = function (query, type, cuisine, diet, includeIngredients, excludeIngredients, minLength, maxLength, offset, number, _options) {
        var result = this.api.searchFoodVideosWithHttpInfo(query, type, cuisine, diet, includeIngredients, excludeIngredients, minLength, maxLength, offset, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchFoodVideos = function (query, type, cuisine, diet, includeIngredients, excludeIngredients, minLength, maxLength, offset, number, _options) {
        var result = this.api.searchFoodVideos(query, type, cuisine, diet, includeIngredients, excludeIngredients, minLength, maxLength, offset, number, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchSiteContentWithHttpInfo = function (query, _options) {
        var result = this.api.searchSiteContentWithHttpInfo(query, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.searchSiteContent = function (query, _options) {
        var result = this.api.searchSiteContent(query, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.talkToChatbotWithHttpInfo = function (text, contextId, _options) {
        var result = this.api.talkToChatbotWithHttpInfo(text, contextId, _options);
        return result.toPromise();
    };
    PromiseMiscApi.prototype.talkToChatbot = function (text, contextId, _options) {
        var result = this.api.talkToChatbot(text, contextId, _options);
        return result.toPromise();
    };
    return PromiseMiscApi;
}());
exports.PromiseMiscApi = PromiseMiscApi;
var ObservableAPI_6 = require("./ObservableAPI");
var PromiseProductsApi = (function () {
    function PromiseProductsApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_6.ObservableProductsApi(configuration, requestFactory, responseProcessor);
    }
    PromiseProductsApi.prototype.autocompleteProductSearchWithHttpInfo = function (query, number, _options) {
        var result = this.api.autocompleteProductSearchWithHttpInfo(query, number, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.autocompleteProductSearch = function (query, number, _options) {
        var result = this.api.autocompleteProductSearch(query, number, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.classifyGroceryProductWithHttpInfo = function (classifyGroceryProductRequest, locale, _options) {
        var result = this.api.classifyGroceryProductWithHttpInfo(classifyGroceryProductRequest, locale, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.classifyGroceryProduct = function (classifyGroceryProductRequest, locale, _options) {
        var result = this.api.classifyGroceryProduct(classifyGroceryProductRequest, locale, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.classifyGroceryProductBulkWithHttpInfo = function (classifyGroceryProductBulkRequestInner, locale, _options) {
        var result = this.api.classifyGroceryProductBulkWithHttpInfo(classifyGroceryProductBulkRequestInner, locale, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.classifyGroceryProductBulk = function (classifyGroceryProductBulkRequestInner, locale, _options) {
        var result = this.api.classifyGroceryProductBulk(classifyGroceryProductBulkRequestInner, locale, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.getComparableProductsWithHttpInfo = function (upc, _options) {
        var result = this.api.getComparableProductsWithHttpInfo(upc, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.getComparableProducts = function (upc, _options) {
        var result = this.api.getComparableProducts(upc, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.getProductInformationWithHttpInfo = function (id, _options) {
        var result = this.api.getProductInformationWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.getProductInformation = function (id, _options) {
        var result = this.api.getProductInformation(id, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.productNutritionByIDImageWithHttpInfo = function (id, _options) {
        var result = this.api.productNutritionByIDImageWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.productNutritionByIDImage = function (id, _options) {
        var result = this.api.productNutritionByIDImage(id, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.productNutritionLabelImageWithHttpInfo = function (id, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.productNutritionLabelImageWithHttpInfo(id, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.productNutritionLabelImage = function (id, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.productNutritionLabelImage(id, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.productNutritionLabelWidgetWithHttpInfo = function (id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.productNutritionLabelWidgetWithHttpInfo(id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.productNutritionLabelWidget = function (id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.productNutritionLabelWidget(id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.searchGroceryProductsWithHttpInfo = function (query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addProductInformation, offset, number, _options) {
        var result = this.api.searchGroceryProductsWithHttpInfo(query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addProductInformation, offset, number, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.searchGroceryProducts = function (query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addProductInformation, offset, number, _options) {
        var result = this.api.searchGroceryProducts(query, minCalories, maxCalories, minCarbs, maxCarbs, minProtein, maxProtein, minFat, maxFat, addProductInformation, offset, number, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.searchGroceryProductsByUPCWithHttpInfo = function (upc, _options) {
        var result = this.api.searchGroceryProductsByUPCWithHttpInfo(upc, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.searchGroceryProductsByUPC = function (upc, _options) {
        var result = this.api.searchGroceryProductsByUPC(upc, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.visualizeProductNutritionByIDWithHttpInfo = function (id, defaultCss, _options) {
        var result = this.api.visualizeProductNutritionByIDWithHttpInfo(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseProductsApi.prototype.visualizeProductNutritionByID = function (id, defaultCss, _options) {
        var result = this.api.visualizeProductNutritionByID(id, defaultCss, _options);
        return result.toPromise();
    };
    return PromiseProductsApi;
}());
exports.PromiseProductsApi = PromiseProductsApi;
var ObservableAPI_7 = require("./ObservableAPI");
var PromiseRecipesApi = (function () {
    function PromiseRecipesApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_7.ObservableRecipesApi(configuration, requestFactory, responseProcessor);
    }
    PromiseRecipesApi.prototype.analyzeARecipeSearchQueryWithHttpInfo = function (q, _options) {
        var result = this.api.analyzeARecipeSearchQueryWithHttpInfo(q, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.analyzeARecipeSearchQuery = function (q, _options) {
        var result = this.api.analyzeARecipeSearchQuery(q, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.analyzeRecipeInstructionsWithHttpInfo = function (instructions, _options) {
        var result = this.api.analyzeRecipeInstructionsWithHttpInfo(instructions, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.analyzeRecipeInstructions = function (instructions, _options) {
        var result = this.api.analyzeRecipeInstructions(instructions, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.autocompleteRecipeSearchWithHttpInfo = function (query, number, _options) {
        var result = this.api.autocompleteRecipeSearchWithHttpInfo(query, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.autocompleteRecipeSearch = function (query, number, _options) {
        var result = this.api.autocompleteRecipeSearch(query, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.classifyCuisineWithHttpInfo = function (title, ingredientList, language, _options) {
        var result = this.api.classifyCuisineWithHttpInfo(title, ingredientList, language, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.classifyCuisine = function (title, ingredientList, language, _options) {
        var result = this.api.classifyCuisine(title, ingredientList, language, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.computeGlycemicLoadWithHttpInfo = function (computeGlycemicLoadRequest, language, _options) {
        var result = this.api.computeGlycemicLoadWithHttpInfo(computeGlycemicLoadRequest, language, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.computeGlycemicLoad = function (computeGlycemicLoadRequest, language, _options) {
        var result = this.api.computeGlycemicLoad(computeGlycemicLoadRequest, language, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.convertAmountsWithHttpInfo = function (ingredientName, sourceAmount, sourceUnit, targetUnit, _options) {
        var result = this.api.convertAmountsWithHttpInfo(ingredientName, sourceAmount, sourceUnit, targetUnit, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.convertAmounts = function (ingredientName, sourceAmount, sourceUnit, targetUnit, _options) {
        var result = this.api.convertAmounts(ingredientName, sourceAmount, sourceUnit, targetUnit, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.createRecipeCardWithHttpInfo = function (title, ingredients, instructions, readyInMinutes, servings, mask, backgroundImage, image, imageUrl, author, backgroundColor, fontColor, source, _options) {
        var result = this.api.createRecipeCardWithHttpInfo(title, ingredients, instructions, readyInMinutes, servings, mask, backgroundImage, image, imageUrl, author, backgroundColor, fontColor, source, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.createRecipeCard = function (title, ingredients, instructions, readyInMinutes, servings, mask, backgroundImage, image, imageUrl, author, backgroundColor, fontColor, source, _options) {
        var result = this.api.createRecipeCard(title, ingredients, instructions, readyInMinutes, servings, mask, backgroundImage, image, imageUrl, author, backgroundColor, fontColor, source, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.equipmentByIDImageWithHttpInfo = function (id, _options) {
        var result = this.api.equipmentByIDImageWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.equipmentByIDImage = function (id, _options) {
        var result = this.api.equipmentByIDImage(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.extractRecipeFromWebsiteWithHttpInfo = function (url, forceExtraction, analyze, includeNutrition, includeTaste, _options) {
        var result = this.api.extractRecipeFromWebsiteWithHttpInfo(url, forceExtraction, analyze, includeNutrition, includeTaste, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.extractRecipeFromWebsite = function (url, forceExtraction, analyze, includeNutrition, includeTaste, _options) {
        var result = this.api.extractRecipeFromWebsite(url, forceExtraction, analyze, includeNutrition, includeTaste, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getAnalyzedRecipeInstructionsWithHttpInfo = function (id, stepBreakdown, _options) {
        var result = this.api.getAnalyzedRecipeInstructionsWithHttpInfo(id, stepBreakdown, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getAnalyzedRecipeInstructions = function (id, stepBreakdown, _options) {
        var result = this.api.getAnalyzedRecipeInstructions(id, stepBreakdown, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRandomRecipesWithHttpInfo = function (includeNutrition, includeTags, excludeTags, number, _options) {
        var result = this.api.getRandomRecipesWithHttpInfo(includeNutrition, includeTags, excludeTags, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRandomRecipes = function (includeNutrition, includeTags, excludeTags, number, _options) {
        var result = this.api.getRandomRecipes(includeNutrition, includeTags, excludeTags, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeEquipmentByIDWithHttpInfo = function (id, _options) {
        var result = this.api.getRecipeEquipmentByIDWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeEquipmentByID = function (id, _options) {
        var result = this.api.getRecipeEquipmentByID(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeInformationWithHttpInfo = function (id, includeNutrition, addWinePairing, addTasteData, _options) {
        var result = this.api.getRecipeInformationWithHttpInfo(id, includeNutrition, addWinePairing, addTasteData, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeInformation = function (id, includeNutrition, addWinePairing, addTasteData, _options) {
        var result = this.api.getRecipeInformation(id, includeNutrition, addWinePairing, addTasteData, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeInformationBulkWithHttpInfo = function (ids, includeNutrition, _options) {
        var result = this.api.getRecipeInformationBulkWithHttpInfo(ids, includeNutrition, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeInformationBulk = function (ids, includeNutrition, _options) {
        var result = this.api.getRecipeInformationBulk(ids, includeNutrition, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeIngredientsByIDWithHttpInfo = function (id, _options) {
        var result = this.api.getRecipeIngredientsByIDWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeIngredientsByID = function (id, _options) {
        var result = this.api.getRecipeIngredientsByID(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeNutritionWidgetByIDWithHttpInfo = function (id, _options) {
        var result = this.api.getRecipeNutritionWidgetByIDWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeNutritionWidgetByID = function (id, _options) {
        var result = this.api.getRecipeNutritionWidgetByID(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipePriceBreakdownByIDWithHttpInfo = function (id, _options) {
        var result = this.api.getRecipePriceBreakdownByIDWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipePriceBreakdownByID = function (id, _options) {
        var result = this.api.getRecipePriceBreakdownByID(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeTasteByIDWithHttpInfo = function (id, normalize, _options) {
        var result = this.api.getRecipeTasteByIDWithHttpInfo(id, normalize, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getRecipeTasteByID = function (id, normalize, _options) {
        var result = this.api.getRecipeTasteByID(id, normalize, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getSimilarRecipesWithHttpInfo = function (id, number, _options) {
        var result = this.api.getSimilarRecipesWithHttpInfo(id, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.getSimilarRecipes = function (id, number, _options) {
        var result = this.api.getSimilarRecipes(id, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.guessNutritionByDishNameWithHttpInfo = function (title, _options) {
        var result = this.api.guessNutritionByDishNameWithHttpInfo(title, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.guessNutritionByDishName = function (title, _options) {
        var result = this.api.guessNutritionByDishName(title, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.parseIngredientsWithHttpInfo = function (ingredientList, servings, language, includeNutrition, _options) {
        var result = this.api.parseIngredientsWithHttpInfo(ingredientList, servings, language, includeNutrition, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.parseIngredients = function (ingredientList, servings, language, includeNutrition, _options) {
        var result = this.api.parseIngredients(ingredientList, servings, language, includeNutrition, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.priceBreakdownByIDImageWithHttpInfo = function (id, _options) {
        var result = this.api.priceBreakdownByIDImageWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.priceBreakdownByIDImage = function (id, _options) {
        var result = this.api.priceBreakdownByIDImage(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.quickAnswerWithHttpInfo = function (q, _options) {
        var result = this.api.quickAnswerWithHttpInfo(q, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.quickAnswer = function (q, _options) {
        var result = this.api.quickAnswer(q, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeNutritionByIDImageWithHttpInfo = function (id, _options) {
        var result = this.api.recipeNutritionByIDImageWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeNutritionByIDImage = function (id, _options) {
        var result = this.api.recipeNutritionByIDImage(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeNutritionLabelImageWithHttpInfo = function (id, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.recipeNutritionLabelImageWithHttpInfo(id, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeNutritionLabelImage = function (id, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.recipeNutritionLabelImage(id, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeNutritionLabelWidgetWithHttpInfo = function (id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.recipeNutritionLabelWidgetWithHttpInfo(id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeNutritionLabelWidget = function (id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options) {
        var result = this.api.recipeNutritionLabelWidget(id, defaultCss, showOptionalNutrients, showZeroValues, showIngredients, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeTasteByIDImageWithHttpInfo = function (id, normalize, rgb, _options) {
        var result = this.api.recipeTasteByIDImageWithHttpInfo(id, normalize, rgb, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.recipeTasteByIDImage = function (id, normalize, rgb, _options) {
        var result = this.api.recipeTasteByIDImage(id, normalize, rgb, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.searchRecipesWithHttpInfo = function (query, cuisine, excludeCuisine, diet, intolerances, equipment, includeIngredients, excludeIngredients, type, instructionsRequired, fillIngredients, addRecipeInformation, addRecipeNutrition, author, tags, recipeBoxId, titleMatch, maxReadyTime, minServings, maxServings, ignorePantry, sort, sortDirection, minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, _options) {
        var result = this.api.searchRecipesWithHttpInfo(query, cuisine, excludeCuisine, diet, intolerances, equipment, includeIngredients, excludeIngredients, type, instructionsRequired, fillIngredients, addRecipeInformation, addRecipeNutrition, author, tags, recipeBoxId, titleMatch, maxReadyTime, minServings, maxServings, ignorePantry, sort, sortDirection, minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.searchRecipes = function (query, cuisine, excludeCuisine, diet, intolerances, equipment, includeIngredients, excludeIngredients, type, instructionsRequired, fillIngredients, addRecipeInformation, addRecipeNutrition, author, tags, recipeBoxId, titleMatch, maxReadyTime, minServings, maxServings, ignorePantry, sort, sortDirection, minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, _options) {
        var result = this.api.searchRecipes(query, cuisine, excludeCuisine, diet, intolerances, equipment, includeIngredients, excludeIngredients, type, instructionsRequired, fillIngredients, addRecipeInformation, addRecipeNutrition, author, tags, recipeBoxId, titleMatch, maxReadyTime, minServings, maxServings, ignorePantry, sort, sortDirection, minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.searchRecipesByIngredientsWithHttpInfo = function (ingredients, number, ranking, ignorePantry, _options) {
        var result = this.api.searchRecipesByIngredientsWithHttpInfo(ingredients, number, ranking, ignorePantry, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.searchRecipesByIngredients = function (ingredients, number, ranking, ignorePantry, _options) {
        var result = this.api.searchRecipesByIngredients(ingredients, number, ranking, ignorePantry, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.searchRecipesByNutrientsWithHttpInfo = function (minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, random, _options) {
        var result = this.api.searchRecipesByNutrientsWithHttpInfo(minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, random, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.searchRecipesByNutrients = function (minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, random, _options) {
        var result = this.api.searchRecipesByNutrients(minCarbs, maxCarbs, minProtein, maxProtein, minCalories, maxCalories, minFat, maxFat, minAlcohol, maxAlcohol, minCaffeine, maxCaffeine, minCopper, maxCopper, minCalcium, maxCalcium, minCholine, maxCholine, minCholesterol, maxCholesterol, minFluoride, maxFluoride, minSaturatedFat, maxSaturatedFat, minVitaminA, maxVitaminA, minVitaminC, maxVitaminC, minVitaminD, maxVitaminD, minVitaminE, maxVitaminE, minVitaminK, maxVitaminK, minVitaminB1, maxVitaminB1, minVitaminB2, maxVitaminB2, minVitaminB5, maxVitaminB5, minVitaminB3, maxVitaminB3, minVitaminB6, maxVitaminB6, minVitaminB12, maxVitaminB12, minFiber, maxFiber, minFolate, maxFolate, minFolicAcid, maxFolicAcid, minIodine, maxIodine, minIron, maxIron, minMagnesium, maxMagnesium, minManganese, maxManganese, minPhosphorus, maxPhosphorus, minPotassium, maxPotassium, minSelenium, maxSelenium, minSodium, maxSodium, minSugar, maxSugar, minZinc, maxZinc, offset, number, random, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.summarizeRecipeWithHttpInfo = function (id, _options) {
        var result = this.api.summarizeRecipeWithHttpInfo(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.summarizeRecipe = function (id, _options) {
        var result = this.api.summarizeRecipe(id, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeEquipmentWithHttpInfo = function (instructions, view, defaultCss, showBacklink, _options) {
        var result = this.api.visualizeEquipmentWithHttpInfo(instructions, view, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeEquipment = function (instructions, view, defaultCss, showBacklink, _options) {
        var result = this.api.visualizeEquipment(instructions, view, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizePriceBreakdownWithHttpInfo = function (ingredientList, servings, language, mode, defaultCss, showBacklink, _options) {
        var result = this.api.visualizePriceBreakdownWithHttpInfo(ingredientList, servings, language, mode, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizePriceBreakdown = function (ingredientList, servings, language, mode, defaultCss, showBacklink, _options) {
        var result = this.api.visualizePriceBreakdown(ingredientList, servings, language, mode, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeEquipmentByIDWithHttpInfo = function (id, defaultCss, _options) {
        var result = this.api.visualizeRecipeEquipmentByIDWithHttpInfo(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeEquipmentByID = function (id, defaultCss, _options) {
        var result = this.api.visualizeRecipeEquipmentByID(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeIngredientsByIDWithHttpInfo = function (id, defaultCss, measure, _options) {
        var result = this.api.visualizeRecipeIngredientsByIDWithHttpInfo(id, defaultCss, measure, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeIngredientsByID = function (id, defaultCss, measure, _options) {
        var result = this.api.visualizeRecipeIngredientsByID(id, defaultCss, measure, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeNutritionWithHttpInfo = function (ingredientList, servings, language, defaultCss, showBacklink, _options) {
        var result = this.api.visualizeRecipeNutritionWithHttpInfo(ingredientList, servings, language, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeNutrition = function (ingredientList, servings, language, defaultCss, showBacklink, _options) {
        var result = this.api.visualizeRecipeNutrition(ingredientList, servings, language, defaultCss, showBacklink, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeNutritionByIDWithHttpInfo = function (id, defaultCss, _options) {
        var result = this.api.visualizeRecipeNutritionByIDWithHttpInfo(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeNutritionByID = function (id, defaultCss, _options) {
        var result = this.api.visualizeRecipeNutritionByID(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipePriceBreakdownByIDWithHttpInfo = function (id, defaultCss, _options) {
        var result = this.api.visualizeRecipePriceBreakdownByIDWithHttpInfo(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipePriceBreakdownByID = function (id, defaultCss, _options) {
        var result = this.api.visualizeRecipePriceBreakdownByID(id, defaultCss, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeTasteWithHttpInfo = function (ingredientList, language, normalize, rgb, _options) {
        var result = this.api.visualizeRecipeTasteWithHttpInfo(ingredientList, language, normalize, rgb, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeTaste = function (ingredientList, language, normalize, rgb, _options) {
        var result = this.api.visualizeRecipeTaste(ingredientList, language, normalize, rgb, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeTasteByIDWithHttpInfo = function (id, normalize, rgb, _options) {
        var result = this.api.visualizeRecipeTasteByIDWithHttpInfo(id, normalize, rgb, _options);
        return result.toPromise();
    };
    PromiseRecipesApi.prototype.visualizeRecipeTasteByID = function (id, normalize, rgb, _options) {
        var result = this.api.visualizeRecipeTasteByID(id, normalize, rgb, _options);
        return result.toPromise();
    };
    return PromiseRecipesApi;
}());
exports.PromiseRecipesApi = PromiseRecipesApi;
var ObservableAPI_8 = require("./ObservableAPI");
var PromiseWineApi = (function () {
    function PromiseWineApi(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_8.ObservableWineApi(configuration, requestFactory, responseProcessor);
    }
    PromiseWineApi.prototype.getDishPairingForWineWithHttpInfo = function (wine, _options) {
        var result = this.api.getDishPairingForWineWithHttpInfo(wine, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getDishPairingForWine = function (wine, _options) {
        var result = this.api.getDishPairingForWine(wine, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getWineDescriptionWithHttpInfo = function (wine, _options) {
        var result = this.api.getWineDescriptionWithHttpInfo(wine, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getWineDescription = function (wine, _options) {
        var result = this.api.getWineDescription(wine, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getWinePairingWithHttpInfo = function (food, maxPrice, _options) {
        var result = this.api.getWinePairingWithHttpInfo(food, maxPrice, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getWinePairing = function (food, maxPrice, _options) {
        var result = this.api.getWinePairing(food, maxPrice, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getWineRecommendationWithHttpInfo = function (wine, maxPrice, minRating, number, _options) {
        var result = this.api.getWineRecommendationWithHttpInfo(wine, maxPrice, minRating, number, _options);
        return result.toPromise();
    };
    PromiseWineApi.prototype.getWineRecommendation = function (wine, maxPrice, minRating, number, _options) {
        var result = this.api.getWineRecommendation(wine, maxPrice, minRating, number, _options);
        return result.toPromise();
    };
    return PromiseWineApi;
}());
exports.PromiseWineApi = PromiseWineApi;
