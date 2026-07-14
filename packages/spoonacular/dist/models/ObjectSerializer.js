"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSerializer = void 0;
__exportStar(require("../models/AddMealPlanTemplate200Response"), exports);
__exportStar(require("../models/AddMealPlanTemplate200ResponseItemsInner"), exports);
__exportStar(require("../models/AddMealPlanTemplate200ResponseItemsInnerValue"), exports);
__exportStar(require("../models/AddToMealPlanRequest"), exports);
__exportStar(require("../models/AddToMealPlanRequestValue"), exports);
__exportStar(require("../models/AddToMealPlanRequestValueIngredientsInner"), exports);
__exportStar(require("../models/AddToShoppingListRequest"), exports);
__exportStar(require("../models/AnalyzeARecipeSearchQuery200Response"), exports);
__exportStar(require("../models/AnalyzeARecipeSearchQuery200ResponseDishesInner"), exports);
__exportStar(require("../models/AnalyzeARecipeSearchQuery200ResponseIngredientsInner"), exports);
__exportStar(require("../models/AnalyzeRecipeInstructions200Response"), exports);
__exportStar(require("../models/AnalyzeRecipeInstructions200ResponseIngredientsInner"), exports);
__exportStar(require("../models/AnalyzeRecipeInstructions200ResponseParsedInstructionsInner"), exports);
__exportStar(require("../models/AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInner"), exports);
__exportStar(require("../models/AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInnerIngredientsInner"), exports);
__exportStar(require("../models/AnalyzeRecipeRequest"), exports);
__exportStar(require("../models/AutocompleteIngredientSearch200ResponseInner"), exports);
__exportStar(require("../models/AutocompleteProductSearch200Response"), exports);
__exportStar(require("../models/AutocompleteProductSearch200ResponseResultsInner"), exports);
__exportStar(require("../models/AutocompleteRecipeSearch200ResponseInner"), exports);
__exportStar(require("../models/ClassifyCuisine200Response"), exports);
__exportStar(require("../models/ClassifyGroceryProduct200Response"), exports);
__exportStar(require("../models/ClassifyGroceryProductBulk200ResponseInner"), exports);
__exportStar(require("../models/ClassifyGroceryProductBulkRequestInner"), exports);
__exportStar(require("../models/ClassifyGroceryProductRequest"), exports);
__exportStar(require("../models/ComparableProduct"), exports);
__exportStar(require("../models/ComputeGlycemicLoad200Response"), exports);
__exportStar(require("../models/ComputeGlycemicLoad200ResponseIngredientsInner"), exports);
__exportStar(require("../models/ComputeGlycemicLoadRequest"), exports);
__exportStar(require("../models/ComputeIngredientAmount200Response"), exports);
__exportStar(require("../models/ConnectUser200Response"), exports);
__exportStar(require("../models/ConnectUserRequest"), exports);
__exportStar(require("../models/ConvertAmounts200Response"), exports);
__exportStar(require("../models/CreateRecipeCard200Response"), exports);
__exportStar(require("../models/DetectFoodInText200Response"), exports);
__exportStar(require("../models/DetectFoodInText200ResponseAnnotationsInner"), exports);
__exportStar(require("../models/GenerateMealPlan200Response"), exports);
__exportStar(require("../models/GenerateMealPlan200ResponseNutrients"), exports);
__exportStar(require("../models/GetARandomFoodJoke200Response"), exports);
__exportStar(require("../models/GetAnalyzedRecipeInstructions200ResponseInner"), exports);
__exportStar(require("../models/GetAnalyzedRecipeInstructions200ResponseInnerStepsInner"), exports);
__exportStar(require("../models/GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner"), exports);
__exportStar(require("../models/GetComparableProducts200Response"), exports);
__exportStar(require("../models/GetComparableProducts200ResponseComparableProducts"), exports);
__exportStar(require("../models/GetConversationSuggests200Response"), exports);
__exportStar(require("../models/GetConversationSuggests200ResponseSuggests"), exports);
__exportStar(require("../models/GetConversationSuggests200ResponseSuggestsInner"), exports);
__exportStar(require("../models/GetDishPairingForWine200Response"), exports);
__exportStar(require("../models/GetIngredientSubstitutes200Response"), exports);
__exportStar(require("../models/GetMealPlanTemplate200Response"), exports);
__exportStar(require("../models/GetMealPlanTemplate200ResponseDaysInner"), exports);
__exportStar(require("../models/GetMealPlanTemplate200ResponseDaysInnerItemsInner"), exports);
__exportStar(require("../models/GetMealPlanTemplate200ResponseDaysInnerItemsInnerValue"), exports);
__exportStar(require("../models/GetMealPlanTemplates200Response"), exports);
__exportStar(require("../models/GetMealPlanTemplates200ResponseTemplatesInner"), exports);
__exportStar(require("../models/GetMealPlanWeek200Response"), exports);
__exportStar(require("../models/GetMealPlanWeek200ResponseDaysInner"), exports);
__exportStar(require("../models/GetMealPlanWeek200ResponseDaysInnerItemsInner"), exports);
__exportStar(require("../models/GetMealPlanWeek200ResponseDaysInnerItemsInnerValue"), exports);
__exportStar(require("../models/GetMealPlanWeek200ResponseDaysInnerNutritionSummary"), exports);
__exportStar(require("../models/GetMealPlanWeek200ResponseDaysInnerNutritionSummaryNutrientsInner"), exports);
__exportStar(require("../models/GetRandomRecipes200Response"), exports);
__exportStar(require("../models/GetRecipeEquipmentByID200Response"), exports);
__exportStar(require("../models/GetRecipeEquipmentByID200ResponseEquipmentInner"), exports);
__exportStar(require("../models/GetRecipeIngredientsByID200Response"), exports);
__exportStar(require("../models/GetRecipeIngredientsByID200ResponseIngredientsInner"), exports);
__exportStar(require("../models/GetRecipeNutritionWidgetByID200Response"), exports);
__exportStar(require("../models/GetRecipeNutritionWidgetByID200ResponseBadInner"), exports);
__exportStar(require("../models/GetRecipeNutritionWidgetByID200ResponseGoodInner"), exports);
__exportStar(require("../models/GetRecipePriceBreakdownByID200Response"), exports);
__exportStar(require("../models/GetRecipePriceBreakdownByID200ResponseIngredientsInner"), exports);
__exportStar(require("../models/GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmount"), exports);
__exportStar(require("../models/GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmountMetric"), exports);
__exportStar(require("../models/GetShoppingList200Response"), exports);
__exportStar(require("../models/GetShoppingList200ResponseAislesInner"), exports);
__exportStar(require("../models/GetShoppingList200ResponseAislesInnerItemsInner"), exports);
__exportStar(require("../models/GetShoppingList200ResponseAislesInnerItemsInnerMeasures"), exports);
__exportStar(require("../models/GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal"), exports);
__exportStar(require("../models/GetSimilarRecipes200ResponseInner"), exports);
__exportStar(require("../models/GetWineDescription200Response"), exports);
__exportStar(require("../models/GetWinePairing200Response"), exports);
__exportStar(require("../models/GetWinePairing200ResponseProductMatchesInner"), exports);
__exportStar(require("../models/GetWineRecommendation200Response"), exports);
__exportStar(require("../models/GetWineRecommendation200ResponseRecommendedWinesInner"), exports);
__exportStar(require("../models/GuessNutritionByDishName200Response"), exports);
__exportStar(require("../models/GuessNutritionByDishName200ResponseCalories"), exports);
__exportStar(require("../models/GuessNutritionByDishName200ResponseCaloriesConfidenceRange95Percent"), exports);
__exportStar(require("../models/ImageAnalysisByURL200Response"), exports);
__exportStar(require("../models/ImageAnalysisByURL200ResponseCategory"), exports);
__exportStar(require("../models/ImageAnalysisByURL200ResponseNutrition"), exports);
__exportStar(require("../models/ImageAnalysisByURL200ResponseNutritionCalories"), exports);
__exportStar(require("../models/ImageAnalysisByURL200ResponseNutritionCaloriesConfidenceRange95Percent"), exports);
__exportStar(require("../models/ImageAnalysisByURL200ResponseRecipesInner"), exports);
__exportStar(require("../models/ImageClassificationByURL200Response"), exports);
__exportStar(require("../models/IngredientBasics"), exports);
__exportStar(require("../models/IngredientInformation"), exports);
__exportStar(require("../models/IngredientInformationEstimatedCost"), exports);
__exportStar(require("../models/IngredientInformationNutrition"), exports);
__exportStar(require("../models/IngredientInformationNutritionPropertiesInner"), exports);
__exportStar(require("../models/IngredientSearch200Response"), exports);
__exportStar(require("../models/IngredientSearch200ResponseResultsInner"), exports);
__exportStar(require("../models/MapIngredientsToGroceryProducts200ResponseInner"), exports);
__exportStar(require("../models/MapIngredientsToGroceryProducts200ResponseInnerProductsInner"), exports);
__exportStar(require("../models/MapIngredientsToGroceryProductsRequest"), exports);
__exportStar(require("../models/MenuItem"), exports);
__exportStar(require("../models/MenuItemServings"), exports);
__exportStar(require("../models/ProductInformation"), exports);
__exportStar(require("../models/ProductInformationCredits"), exports);
__exportStar(require("../models/QuickAnswer200Response"), exports);
__exportStar(require("../models/RecipeInformation"), exports);
__exportStar(require("../models/RecipeInformationExtendedIngredientsInner"), exports);
__exportStar(require("../models/RecipeInformationExtendedIngredientsInnerMeasures"), exports);
__exportStar(require("../models/RecipeInformationExtendedIngredientsInnerMeasuresMetric"), exports);
__exportStar(require("../models/RecipeInformationWinePairing"), exports);
__exportStar(require("../models/RecipeInformationWinePairingProductMatchesInner"), exports);
__exportStar(require("../models/SearchAllFood200Response"), exports);
__exportStar(require("../models/SearchAllFood200ResponseSearchResultsInner"), exports);
__exportStar(require("../models/SearchCustomFoods200Response"), exports);
__exportStar(require("../models/SearchCustomFoods200ResponseCustomFoodsInner"), exports);
__exportStar(require("../models/SearchFoodVideos200Response"), exports);
__exportStar(require("../models/SearchFoodVideos200ResponseVideosInner"), exports);
__exportStar(require("../models/SearchGroceryProducts200Response"), exports);
__exportStar(require("../models/SearchGroceryProductsByUPC200Response"), exports);
__exportStar(require("../models/SearchGroceryProductsByUPC200ResponseNutrition"), exports);
__exportStar(require("../models/SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown"), exports);
__exportStar(require("../models/SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner"), exports);
__exportStar(require("../models/SearchGroceryProductsByUPC200ResponseServings"), exports);
__exportStar(require("../models/SearchMenuItems200Response"), exports);
__exportStar(require("../models/SearchRecipes200Response"), exports);
__exportStar(require("../models/SearchRecipes200ResponseResultsInner"), exports);
__exportStar(require("../models/SearchRecipesByIngredients200ResponseInner"), exports);
__exportStar(require("../models/SearchRecipesByIngredients200ResponseInnerMissedIngredientsInner"), exports);
__exportStar(require("../models/SearchRecipesByNutrients200ResponseInner"), exports);
__exportStar(require("../models/SearchRestaurants200Response"), exports);
__exportStar(require("../models/SearchRestaurants200ResponseRestaurantsInner"), exports);
__exportStar(require("../models/SearchRestaurants200ResponseRestaurantsInnerAddress"), exports);
__exportStar(require("../models/SearchRestaurants200ResponseRestaurantsInnerLocalHours"), exports);
__exportStar(require("../models/SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational"), exports);
__exportStar(require("../models/SearchResult"), exports);
__exportStar(require("../models/SearchSiteContent200Response"), exports);
__exportStar(require("../models/SummarizeRecipe200Response"), exports);
__exportStar(require("../models/TalkToChatbot200Response"), exports);
__exportStar(require("../models/TalkToChatbot200ResponseMediaInner"), exports);
__exportStar(require("../models/TasteInformation"), exports);
var AddMealPlanTemplate200Response_1 = require("../models/AddMealPlanTemplate200Response");
var AddMealPlanTemplate200ResponseItemsInner_1 = require("../models/AddMealPlanTemplate200ResponseItemsInner");
var AddMealPlanTemplate200ResponseItemsInnerValue_1 = require("../models/AddMealPlanTemplate200ResponseItemsInnerValue");
var AddToMealPlanRequest_1 = require("../models/AddToMealPlanRequest");
var AddToMealPlanRequestValue_1 = require("../models/AddToMealPlanRequestValue");
var AddToMealPlanRequestValueIngredientsInner_1 = require("../models/AddToMealPlanRequestValueIngredientsInner");
var AddToShoppingListRequest_1 = require("../models/AddToShoppingListRequest");
var AnalyzeARecipeSearchQuery200Response_1 = require("../models/AnalyzeARecipeSearchQuery200Response");
var AnalyzeARecipeSearchQuery200ResponseDishesInner_1 = require("../models/AnalyzeARecipeSearchQuery200ResponseDishesInner");
var AnalyzeARecipeSearchQuery200ResponseIngredientsInner_1 = require("../models/AnalyzeARecipeSearchQuery200ResponseIngredientsInner");
var AnalyzeRecipeInstructions200Response_1 = require("../models/AnalyzeRecipeInstructions200Response");
var AnalyzeRecipeInstructions200ResponseIngredientsInner_1 = require("../models/AnalyzeRecipeInstructions200ResponseIngredientsInner");
var AnalyzeRecipeInstructions200ResponseParsedInstructionsInner_1 = require("../models/AnalyzeRecipeInstructions200ResponseParsedInstructionsInner");
var AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInner_1 = require("../models/AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInner");
var AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInnerIngredientsInner_1 = require("../models/AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInnerIngredientsInner");
var AnalyzeRecipeRequest_1 = require("../models/AnalyzeRecipeRequest");
var AutocompleteIngredientSearch200ResponseInner_1 = require("../models/AutocompleteIngredientSearch200ResponseInner");
var AutocompleteProductSearch200Response_1 = require("../models/AutocompleteProductSearch200Response");
var AutocompleteProductSearch200ResponseResultsInner_1 = require("../models/AutocompleteProductSearch200ResponseResultsInner");
var AutocompleteRecipeSearch200ResponseInner_1 = require("../models/AutocompleteRecipeSearch200ResponseInner");
var ClassifyCuisine200Response_1 = require("../models/ClassifyCuisine200Response");
var ClassifyGroceryProduct200Response_1 = require("../models/ClassifyGroceryProduct200Response");
var ClassifyGroceryProductBulk200ResponseInner_1 = require("../models/ClassifyGroceryProductBulk200ResponseInner");
var ClassifyGroceryProductBulkRequestInner_1 = require("../models/ClassifyGroceryProductBulkRequestInner");
var ClassifyGroceryProductRequest_1 = require("../models/ClassifyGroceryProductRequest");
var ComparableProduct_1 = require("../models/ComparableProduct");
var ComputeGlycemicLoad200Response_1 = require("../models/ComputeGlycemicLoad200Response");
var ComputeGlycemicLoad200ResponseIngredientsInner_1 = require("../models/ComputeGlycemicLoad200ResponseIngredientsInner");
var ComputeGlycemicLoadRequest_1 = require("../models/ComputeGlycemicLoadRequest");
var ComputeIngredientAmount200Response_1 = require("../models/ComputeIngredientAmount200Response");
var ConnectUser200Response_1 = require("../models/ConnectUser200Response");
var ConnectUserRequest_1 = require("../models/ConnectUserRequest");
var ConvertAmounts200Response_1 = require("../models/ConvertAmounts200Response");
var CreateRecipeCard200Response_1 = require("../models/CreateRecipeCard200Response");
var DetectFoodInText200Response_1 = require("../models/DetectFoodInText200Response");
var DetectFoodInText200ResponseAnnotationsInner_1 = require("../models/DetectFoodInText200ResponseAnnotationsInner");
var GenerateMealPlan200Response_1 = require("../models/GenerateMealPlan200Response");
var GenerateMealPlan200ResponseNutrients_1 = require("../models/GenerateMealPlan200ResponseNutrients");
var GetARandomFoodJoke200Response_1 = require("../models/GetARandomFoodJoke200Response");
var GetAnalyzedRecipeInstructions200ResponseInner_1 = require("../models/GetAnalyzedRecipeInstructions200ResponseInner");
var GetAnalyzedRecipeInstructions200ResponseInnerStepsInner_1 = require("../models/GetAnalyzedRecipeInstructions200ResponseInnerStepsInner");
var GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner_1 = require("../models/GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner");
var GetComparableProducts200Response_1 = require("../models/GetComparableProducts200Response");
var GetComparableProducts200ResponseComparableProducts_1 = require("../models/GetComparableProducts200ResponseComparableProducts");
var GetConversationSuggests200Response_1 = require("../models/GetConversationSuggests200Response");
var GetConversationSuggests200ResponseSuggests_1 = require("../models/GetConversationSuggests200ResponseSuggests");
var GetConversationSuggests200ResponseSuggestsInner_1 = require("../models/GetConversationSuggests200ResponseSuggestsInner");
var GetDishPairingForWine200Response_1 = require("../models/GetDishPairingForWine200Response");
var GetIngredientSubstitutes200Response_1 = require("../models/GetIngredientSubstitutes200Response");
var GetMealPlanTemplate200Response_1 = require("../models/GetMealPlanTemplate200Response");
var GetMealPlanTemplate200ResponseDaysInner_1 = require("../models/GetMealPlanTemplate200ResponseDaysInner");
var GetMealPlanTemplate200ResponseDaysInnerItemsInner_1 = require("../models/GetMealPlanTemplate200ResponseDaysInnerItemsInner");
var GetMealPlanTemplate200ResponseDaysInnerItemsInnerValue_1 = require("../models/GetMealPlanTemplate200ResponseDaysInnerItemsInnerValue");
var GetMealPlanTemplates200Response_1 = require("../models/GetMealPlanTemplates200Response");
var GetMealPlanTemplates200ResponseTemplatesInner_1 = require("../models/GetMealPlanTemplates200ResponseTemplatesInner");
var GetMealPlanWeek200Response_1 = require("../models/GetMealPlanWeek200Response");
var GetMealPlanWeek200ResponseDaysInner_1 = require("../models/GetMealPlanWeek200ResponseDaysInner");
var GetMealPlanWeek200ResponseDaysInnerItemsInner_1 = require("../models/GetMealPlanWeek200ResponseDaysInnerItemsInner");
var GetMealPlanWeek200ResponseDaysInnerItemsInnerValue_1 = require("../models/GetMealPlanWeek200ResponseDaysInnerItemsInnerValue");
var GetMealPlanWeek200ResponseDaysInnerNutritionSummary_1 = require("../models/GetMealPlanWeek200ResponseDaysInnerNutritionSummary");
var GetMealPlanWeek200ResponseDaysInnerNutritionSummaryNutrientsInner_1 = require("../models/GetMealPlanWeek200ResponseDaysInnerNutritionSummaryNutrientsInner");
var GetRandomRecipes200Response_1 = require("../models/GetRandomRecipes200Response");
var GetRecipeEquipmentByID200Response_1 = require("../models/GetRecipeEquipmentByID200Response");
var GetRecipeEquipmentByID200ResponseEquipmentInner_1 = require("../models/GetRecipeEquipmentByID200ResponseEquipmentInner");
var GetRecipeIngredientsByID200Response_1 = require("../models/GetRecipeIngredientsByID200Response");
var GetRecipeIngredientsByID200ResponseIngredientsInner_1 = require("../models/GetRecipeIngredientsByID200ResponseIngredientsInner");
var GetRecipeNutritionWidgetByID200Response_1 = require("../models/GetRecipeNutritionWidgetByID200Response");
var GetRecipeNutritionWidgetByID200ResponseBadInner_1 = require("../models/GetRecipeNutritionWidgetByID200ResponseBadInner");
var GetRecipeNutritionWidgetByID200ResponseGoodInner_1 = require("../models/GetRecipeNutritionWidgetByID200ResponseGoodInner");
var GetRecipePriceBreakdownByID200Response_1 = require("../models/GetRecipePriceBreakdownByID200Response");
var GetRecipePriceBreakdownByID200ResponseIngredientsInner_1 = require("../models/GetRecipePriceBreakdownByID200ResponseIngredientsInner");
var GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmount_1 = require("../models/GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmount");
var GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmountMetric_1 = require("../models/GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmountMetric");
var GetShoppingList200Response_1 = require("../models/GetShoppingList200Response");
var GetShoppingList200ResponseAislesInner_1 = require("../models/GetShoppingList200ResponseAislesInner");
var GetShoppingList200ResponseAislesInnerItemsInner_1 = require("../models/GetShoppingList200ResponseAislesInnerItemsInner");
var GetShoppingList200ResponseAislesInnerItemsInnerMeasures_1 = require("../models/GetShoppingList200ResponseAislesInnerItemsInnerMeasures");
var GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal_1 = require("../models/GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal");
var GetSimilarRecipes200ResponseInner_1 = require("../models/GetSimilarRecipes200ResponseInner");
var GetWineDescription200Response_1 = require("../models/GetWineDescription200Response");
var GetWinePairing200Response_1 = require("../models/GetWinePairing200Response");
var GetWinePairing200ResponseProductMatchesInner_1 = require("../models/GetWinePairing200ResponseProductMatchesInner");
var GetWineRecommendation200Response_1 = require("../models/GetWineRecommendation200Response");
var GetWineRecommendation200ResponseRecommendedWinesInner_1 = require("../models/GetWineRecommendation200ResponseRecommendedWinesInner");
var GuessNutritionByDishName200Response_1 = require("../models/GuessNutritionByDishName200Response");
var GuessNutritionByDishName200ResponseCalories_1 = require("../models/GuessNutritionByDishName200ResponseCalories");
var GuessNutritionByDishName200ResponseCaloriesConfidenceRange95Percent_1 = require("../models/GuessNutritionByDishName200ResponseCaloriesConfidenceRange95Percent");
var ImageAnalysisByURL200Response_1 = require("../models/ImageAnalysisByURL200Response");
var ImageAnalysisByURL200ResponseCategory_1 = require("../models/ImageAnalysisByURL200ResponseCategory");
var ImageAnalysisByURL200ResponseNutrition_1 = require("../models/ImageAnalysisByURL200ResponseNutrition");
var ImageAnalysisByURL200ResponseNutritionCalories_1 = require("../models/ImageAnalysisByURL200ResponseNutritionCalories");
var ImageAnalysisByURL200ResponseNutritionCaloriesConfidenceRange95Percent_1 = require("../models/ImageAnalysisByURL200ResponseNutritionCaloriesConfidenceRange95Percent");
var ImageAnalysisByURL200ResponseRecipesInner_1 = require("../models/ImageAnalysisByURL200ResponseRecipesInner");
var ImageClassificationByURL200Response_1 = require("../models/ImageClassificationByURL200Response");
var IngredientBasics_1 = require("../models/IngredientBasics");
var IngredientInformation_1 = require("../models/IngredientInformation");
var IngredientInformationEstimatedCost_1 = require("../models/IngredientInformationEstimatedCost");
var IngredientInformationNutrition_1 = require("../models/IngredientInformationNutrition");
var IngredientInformationNutritionPropertiesInner_1 = require("../models/IngredientInformationNutritionPropertiesInner");
var IngredientSearch200Response_1 = require("../models/IngredientSearch200Response");
var IngredientSearch200ResponseResultsInner_1 = require("../models/IngredientSearch200ResponseResultsInner");
var MapIngredientsToGroceryProducts200ResponseInner_1 = require("../models/MapIngredientsToGroceryProducts200ResponseInner");
var MapIngredientsToGroceryProducts200ResponseInnerProductsInner_1 = require("../models/MapIngredientsToGroceryProducts200ResponseInnerProductsInner");
var MapIngredientsToGroceryProductsRequest_1 = require("../models/MapIngredientsToGroceryProductsRequest");
var MenuItem_1 = require("../models/MenuItem");
var MenuItemServings_1 = require("../models/MenuItemServings");
var ProductInformation_1 = require("../models/ProductInformation");
var ProductInformationCredits_1 = require("../models/ProductInformationCredits");
var QuickAnswer200Response_1 = require("../models/QuickAnswer200Response");
var RecipeInformation_1 = require("../models/RecipeInformation");
var RecipeInformationExtendedIngredientsInner_1 = require("../models/RecipeInformationExtendedIngredientsInner");
var RecipeInformationExtendedIngredientsInnerMeasures_1 = require("../models/RecipeInformationExtendedIngredientsInnerMeasures");
var RecipeInformationExtendedIngredientsInnerMeasuresMetric_1 = require("../models/RecipeInformationExtendedIngredientsInnerMeasuresMetric");
var RecipeInformationWinePairing_1 = require("../models/RecipeInformationWinePairing");
var RecipeInformationWinePairingProductMatchesInner_1 = require("../models/RecipeInformationWinePairingProductMatchesInner");
var SearchAllFood200Response_1 = require("../models/SearchAllFood200Response");
var SearchAllFood200ResponseSearchResultsInner_1 = require("../models/SearchAllFood200ResponseSearchResultsInner");
var SearchCustomFoods200Response_1 = require("../models/SearchCustomFoods200Response");
var SearchCustomFoods200ResponseCustomFoodsInner_1 = require("../models/SearchCustomFoods200ResponseCustomFoodsInner");
var SearchFoodVideos200Response_1 = require("../models/SearchFoodVideos200Response");
var SearchFoodVideos200ResponseVideosInner_1 = require("../models/SearchFoodVideos200ResponseVideosInner");
var SearchGroceryProducts200Response_1 = require("../models/SearchGroceryProducts200Response");
var SearchGroceryProductsByUPC200Response_1 = require("../models/SearchGroceryProductsByUPC200Response");
var SearchGroceryProductsByUPC200ResponseNutrition_1 = require("../models/SearchGroceryProductsByUPC200ResponseNutrition");
var SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown_1 = require("../models/SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown");
var SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner_1 = require("../models/SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner");
var SearchGroceryProductsByUPC200ResponseServings_1 = require("../models/SearchGroceryProductsByUPC200ResponseServings");
var SearchMenuItems200Response_1 = require("../models/SearchMenuItems200Response");
var SearchRecipes200Response_1 = require("../models/SearchRecipes200Response");
var SearchRecipes200ResponseResultsInner_1 = require("../models/SearchRecipes200ResponseResultsInner");
var SearchRecipesByIngredients200ResponseInner_1 = require("../models/SearchRecipesByIngredients200ResponseInner");
var SearchRecipesByIngredients200ResponseInnerMissedIngredientsInner_1 = require("../models/SearchRecipesByIngredients200ResponseInnerMissedIngredientsInner");
var SearchRecipesByNutrients200ResponseInner_1 = require("../models/SearchRecipesByNutrients200ResponseInner");
var SearchRestaurants200Response_1 = require("../models/SearchRestaurants200Response");
var SearchRestaurants200ResponseRestaurantsInner_1 = require("../models/SearchRestaurants200ResponseRestaurantsInner");
var SearchRestaurants200ResponseRestaurantsInnerAddress_1 = require("../models/SearchRestaurants200ResponseRestaurantsInnerAddress");
var SearchRestaurants200ResponseRestaurantsInnerLocalHours_1 = require("../models/SearchRestaurants200ResponseRestaurantsInnerLocalHours");
var SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational_1 = require("../models/SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational");
var SearchResult_1 = require("../models/SearchResult");
var SearchSiteContent200Response_1 = require("../models/SearchSiteContent200Response");
var SummarizeRecipe200Response_1 = require("../models/SummarizeRecipe200Response");
var TalkToChatbot200Response_1 = require("../models/TalkToChatbot200Response");
var TalkToChatbot200ResponseMediaInner_1 = require("../models/TalkToChatbot200ResponseMediaInner");
var TasteInformation_1 = require("../models/TasteInformation");
var primitives = [
    "string",
    "boolean",
    "double",
    "integer",
    "long",
    "float",
    "number",
    "any"
];
var enumsMap = new Set([]);
var typeMap = {
    "AddMealPlanTemplate200Response": AddMealPlanTemplate200Response_1.AddMealPlanTemplate200Response,
    "AddMealPlanTemplate200ResponseItemsInner": AddMealPlanTemplate200ResponseItemsInner_1.AddMealPlanTemplate200ResponseItemsInner,
    "AddMealPlanTemplate200ResponseItemsInnerValue": AddMealPlanTemplate200ResponseItemsInnerValue_1.AddMealPlanTemplate200ResponseItemsInnerValue,
    "AddToMealPlanRequest": AddToMealPlanRequest_1.AddToMealPlanRequest,
    "AddToMealPlanRequestValue": AddToMealPlanRequestValue_1.AddToMealPlanRequestValue,
    "AddToMealPlanRequestValueIngredientsInner": AddToMealPlanRequestValueIngredientsInner_1.AddToMealPlanRequestValueIngredientsInner,
    "AddToShoppingListRequest": AddToShoppingListRequest_1.AddToShoppingListRequest,
    "AnalyzeARecipeSearchQuery200Response": AnalyzeARecipeSearchQuery200Response_1.AnalyzeARecipeSearchQuery200Response,
    "AnalyzeARecipeSearchQuery200ResponseDishesInner": AnalyzeARecipeSearchQuery200ResponseDishesInner_1.AnalyzeARecipeSearchQuery200ResponseDishesInner,
    "AnalyzeARecipeSearchQuery200ResponseIngredientsInner": AnalyzeARecipeSearchQuery200ResponseIngredientsInner_1.AnalyzeARecipeSearchQuery200ResponseIngredientsInner,
    "AnalyzeRecipeInstructions200Response": AnalyzeRecipeInstructions200Response_1.AnalyzeRecipeInstructions200Response,
    "AnalyzeRecipeInstructions200ResponseIngredientsInner": AnalyzeRecipeInstructions200ResponseIngredientsInner_1.AnalyzeRecipeInstructions200ResponseIngredientsInner,
    "AnalyzeRecipeInstructions200ResponseParsedInstructionsInner": AnalyzeRecipeInstructions200ResponseParsedInstructionsInner_1.AnalyzeRecipeInstructions200ResponseParsedInstructionsInner,
    "AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInner": AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInner_1.AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInner,
    "AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInnerIngredientsInner": AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInnerIngredientsInner_1.AnalyzeRecipeInstructions200ResponseParsedInstructionsInnerStepsInnerIngredientsInner,
    "AnalyzeRecipeRequest": AnalyzeRecipeRequest_1.AnalyzeRecipeRequest,
    "AutocompleteIngredientSearch200ResponseInner": AutocompleteIngredientSearch200ResponseInner_1.AutocompleteIngredientSearch200ResponseInner,
    "AutocompleteProductSearch200Response": AutocompleteProductSearch200Response_1.AutocompleteProductSearch200Response,
    "AutocompleteProductSearch200ResponseResultsInner": AutocompleteProductSearch200ResponseResultsInner_1.AutocompleteProductSearch200ResponseResultsInner,
    "AutocompleteRecipeSearch200ResponseInner": AutocompleteRecipeSearch200ResponseInner_1.AutocompleteRecipeSearch200ResponseInner,
    "ClassifyCuisine200Response": ClassifyCuisine200Response_1.ClassifyCuisine200Response,
    "ClassifyGroceryProduct200Response": ClassifyGroceryProduct200Response_1.ClassifyGroceryProduct200Response,
    "ClassifyGroceryProductBulk200ResponseInner": ClassifyGroceryProductBulk200ResponseInner_1.ClassifyGroceryProductBulk200ResponseInner,
    "ClassifyGroceryProductBulkRequestInner": ClassifyGroceryProductBulkRequestInner_1.ClassifyGroceryProductBulkRequestInner,
    "ClassifyGroceryProductRequest": ClassifyGroceryProductRequest_1.ClassifyGroceryProductRequest,
    "ComparableProduct": ComparableProduct_1.ComparableProduct,
    "ComputeGlycemicLoad200Response": ComputeGlycemicLoad200Response_1.ComputeGlycemicLoad200Response,
    "ComputeGlycemicLoad200ResponseIngredientsInner": ComputeGlycemicLoad200ResponseIngredientsInner_1.ComputeGlycemicLoad200ResponseIngredientsInner,
    "ComputeGlycemicLoadRequest": ComputeGlycemicLoadRequest_1.ComputeGlycemicLoadRequest,
    "ComputeIngredientAmount200Response": ComputeIngredientAmount200Response_1.ComputeIngredientAmount200Response,
    "ConnectUser200Response": ConnectUser200Response_1.ConnectUser200Response,
    "ConnectUserRequest": ConnectUserRequest_1.ConnectUserRequest,
    "ConvertAmounts200Response": ConvertAmounts200Response_1.ConvertAmounts200Response,
    "CreateRecipeCard200Response": CreateRecipeCard200Response_1.CreateRecipeCard200Response,
    "DetectFoodInText200Response": DetectFoodInText200Response_1.DetectFoodInText200Response,
    "DetectFoodInText200ResponseAnnotationsInner": DetectFoodInText200ResponseAnnotationsInner_1.DetectFoodInText200ResponseAnnotationsInner,
    "GenerateMealPlan200Response": GenerateMealPlan200Response_1.GenerateMealPlan200Response,
    "GenerateMealPlan200ResponseNutrients": GenerateMealPlan200ResponseNutrients_1.GenerateMealPlan200ResponseNutrients,
    "GetARandomFoodJoke200Response": GetARandomFoodJoke200Response_1.GetARandomFoodJoke200Response,
    "GetAnalyzedRecipeInstructions200ResponseInner": GetAnalyzedRecipeInstructions200ResponseInner_1.GetAnalyzedRecipeInstructions200ResponseInner,
    "GetAnalyzedRecipeInstructions200ResponseInnerStepsInner": GetAnalyzedRecipeInstructions200ResponseInnerStepsInner_1.GetAnalyzedRecipeInstructions200ResponseInnerStepsInner,
    "GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner": GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner_1.GetAnalyzedRecipeInstructions200ResponseInnerStepsInnerIngredientsInner,
    "GetComparableProducts200Response": GetComparableProducts200Response_1.GetComparableProducts200Response,
    "GetComparableProducts200ResponseComparableProducts": GetComparableProducts200ResponseComparableProducts_1.GetComparableProducts200ResponseComparableProducts,
    "GetConversationSuggests200Response": GetConversationSuggests200Response_1.GetConversationSuggests200Response,
    "GetConversationSuggests200ResponseSuggests": GetConversationSuggests200ResponseSuggests_1.GetConversationSuggests200ResponseSuggests,
    "GetConversationSuggests200ResponseSuggestsInner": GetConversationSuggests200ResponseSuggestsInner_1.GetConversationSuggests200ResponseSuggestsInner,
    "GetDishPairingForWine200Response": GetDishPairingForWine200Response_1.GetDishPairingForWine200Response,
    "GetIngredientSubstitutes200Response": GetIngredientSubstitutes200Response_1.GetIngredientSubstitutes200Response,
    "GetMealPlanTemplate200Response": GetMealPlanTemplate200Response_1.GetMealPlanTemplate200Response,
    "GetMealPlanTemplate200ResponseDaysInner": GetMealPlanTemplate200ResponseDaysInner_1.GetMealPlanTemplate200ResponseDaysInner,
    "GetMealPlanTemplate200ResponseDaysInnerItemsInner": GetMealPlanTemplate200ResponseDaysInnerItemsInner_1.GetMealPlanTemplate200ResponseDaysInnerItemsInner,
    "GetMealPlanTemplate200ResponseDaysInnerItemsInnerValue": GetMealPlanTemplate200ResponseDaysInnerItemsInnerValue_1.GetMealPlanTemplate200ResponseDaysInnerItemsInnerValue,
    "GetMealPlanTemplates200Response": GetMealPlanTemplates200Response_1.GetMealPlanTemplates200Response,
    "GetMealPlanTemplates200ResponseTemplatesInner": GetMealPlanTemplates200ResponseTemplatesInner_1.GetMealPlanTemplates200ResponseTemplatesInner,
    "GetMealPlanWeek200Response": GetMealPlanWeek200Response_1.GetMealPlanWeek200Response,
    "GetMealPlanWeek200ResponseDaysInner": GetMealPlanWeek200ResponseDaysInner_1.GetMealPlanWeek200ResponseDaysInner,
    "GetMealPlanWeek200ResponseDaysInnerItemsInner": GetMealPlanWeek200ResponseDaysInnerItemsInner_1.GetMealPlanWeek200ResponseDaysInnerItemsInner,
    "GetMealPlanWeek200ResponseDaysInnerItemsInnerValue": GetMealPlanWeek200ResponseDaysInnerItemsInnerValue_1.GetMealPlanWeek200ResponseDaysInnerItemsInnerValue,
    "GetMealPlanWeek200ResponseDaysInnerNutritionSummary": GetMealPlanWeek200ResponseDaysInnerNutritionSummary_1.GetMealPlanWeek200ResponseDaysInnerNutritionSummary,
    "GetMealPlanWeek200ResponseDaysInnerNutritionSummaryNutrientsInner": GetMealPlanWeek200ResponseDaysInnerNutritionSummaryNutrientsInner_1.GetMealPlanWeek200ResponseDaysInnerNutritionSummaryNutrientsInner,
    "GetRandomRecipes200Response": GetRandomRecipes200Response_1.GetRandomRecipes200Response,
    "GetRecipeEquipmentByID200Response": GetRecipeEquipmentByID200Response_1.GetRecipeEquipmentByID200Response,
    "GetRecipeEquipmentByID200ResponseEquipmentInner": GetRecipeEquipmentByID200ResponseEquipmentInner_1.GetRecipeEquipmentByID200ResponseEquipmentInner,
    "GetRecipeIngredientsByID200Response": GetRecipeIngredientsByID200Response_1.GetRecipeIngredientsByID200Response,
    "GetRecipeIngredientsByID200ResponseIngredientsInner": GetRecipeIngredientsByID200ResponseIngredientsInner_1.GetRecipeIngredientsByID200ResponseIngredientsInner,
    "GetRecipeNutritionWidgetByID200Response": GetRecipeNutritionWidgetByID200Response_1.GetRecipeNutritionWidgetByID200Response,
    "GetRecipeNutritionWidgetByID200ResponseBadInner": GetRecipeNutritionWidgetByID200ResponseBadInner_1.GetRecipeNutritionWidgetByID200ResponseBadInner,
    "GetRecipeNutritionWidgetByID200ResponseGoodInner": GetRecipeNutritionWidgetByID200ResponseGoodInner_1.GetRecipeNutritionWidgetByID200ResponseGoodInner,
    "GetRecipePriceBreakdownByID200Response": GetRecipePriceBreakdownByID200Response_1.GetRecipePriceBreakdownByID200Response,
    "GetRecipePriceBreakdownByID200ResponseIngredientsInner": GetRecipePriceBreakdownByID200ResponseIngredientsInner_1.GetRecipePriceBreakdownByID200ResponseIngredientsInner,
    "GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmount": GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmount_1.GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmount,
    "GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmountMetric": GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmountMetric_1.GetRecipePriceBreakdownByID200ResponseIngredientsInnerAmountMetric,
    "GetShoppingList200Response": GetShoppingList200Response_1.GetShoppingList200Response,
    "GetShoppingList200ResponseAislesInner": GetShoppingList200ResponseAislesInner_1.GetShoppingList200ResponseAislesInner,
    "GetShoppingList200ResponseAislesInnerItemsInner": GetShoppingList200ResponseAislesInnerItemsInner_1.GetShoppingList200ResponseAislesInnerItemsInner,
    "GetShoppingList200ResponseAislesInnerItemsInnerMeasures": GetShoppingList200ResponseAislesInnerItemsInnerMeasures_1.GetShoppingList200ResponseAislesInnerItemsInnerMeasures,
    "GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal": GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal_1.GetShoppingList200ResponseAislesInnerItemsInnerMeasuresOriginal,
    "GetSimilarRecipes200ResponseInner": GetSimilarRecipes200ResponseInner_1.GetSimilarRecipes200ResponseInner,
    "GetWineDescription200Response": GetWineDescription200Response_1.GetWineDescription200Response,
    "GetWinePairing200Response": GetWinePairing200Response_1.GetWinePairing200Response,
    "GetWinePairing200ResponseProductMatchesInner": GetWinePairing200ResponseProductMatchesInner_1.GetWinePairing200ResponseProductMatchesInner,
    "GetWineRecommendation200Response": GetWineRecommendation200Response_1.GetWineRecommendation200Response,
    "GetWineRecommendation200ResponseRecommendedWinesInner": GetWineRecommendation200ResponseRecommendedWinesInner_1.GetWineRecommendation200ResponseRecommendedWinesInner,
    "GuessNutritionByDishName200Response": GuessNutritionByDishName200Response_1.GuessNutritionByDishName200Response,
    "GuessNutritionByDishName200ResponseCalories": GuessNutritionByDishName200ResponseCalories_1.GuessNutritionByDishName200ResponseCalories,
    "GuessNutritionByDishName200ResponseCaloriesConfidenceRange95Percent": GuessNutritionByDishName200ResponseCaloriesConfidenceRange95Percent_1.GuessNutritionByDishName200ResponseCaloriesConfidenceRange95Percent,
    "ImageAnalysisByURL200Response": ImageAnalysisByURL200Response_1.ImageAnalysisByURL200Response,
    "ImageAnalysisByURL200ResponseCategory": ImageAnalysisByURL200ResponseCategory_1.ImageAnalysisByURL200ResponseCategory,
    "ImageAnalysisByURL200ResponseNutrition": ImageAnalysisByURL200ResponseNutrition_1.ImageAnalysisByURL200ResponseNutrition,
    "ImageAnalysisByURL200ResponseNutritionCalories": ImageAnalysisByURL200ResponseNutritionCalories_1.ImageAnalysisByURL200ResponseNutritionCalories,
    "ImageAnalysisByURL200ResponseNutritionCaloriesConfidenceRange95Percent": ImageAnalysisByURL200ResponseNutritionCaloriesConfidenceRange95Percent_1.ImageAnalysisByURL200ResponseNutritionCaloriesConfidenceRange95Percent,
    "ImageAnalysisByURL200ResponseRecipesInner": ImageAnalysisByURL200ResponseRecipesInner_1.ImageAnalysisByURL200ResponseRecipesInner,
    "ImageClassificationByURL200Response": ImageClassificationByURL200Response_1.ImageClassificationByURL200Response,
    "IngredientBasics": IngredientBasics_1.IngredientBasics,
    "IngredientInformation": IngredientInformation_1.IngredientInformation,
    "IngredientInformationEstimatedCost": IngredientInformationEstimatedCost_1.IngredientInformationEstimatedCost,
    "IngredientInformationNutrition": IngredientInformationNutrition_1.IngredientInformationNutrition,
    "IngredientInformationNutritionPropertiesInner": IngredientInformationNutritionPropertiesInner_1.IngredientInformationNutritionPropertiesInner,
    "IngredientSearch200Response": IngredientSearch200Response_1.IngredientSearch200Response,
    "IngredientSearch200ResponseResultsInner": IngredientSearch200ResponseResultsInner_1.IngredientSearch200ResponseResultsInner,
    "MapIngredientsToGroceryProducts200ResponseInner": MapIngredientsToGroceryProducts200ResponseInner_1.MapIngredientsToGroceryProducts200ResponseInner,
    "MapIngredientsToGroceryProducts200ResponseInnerProductsInner": MapIngredientsToGroceryProducts200ResponseInnerProductsInner_1.MapIngredientsToGroceryProducts200ResponseInnerProductsInner,
    "MapIngredientsToGroceryProductsRequest": MapIngredientsToGroceryProductsRequest_1.MapIngredientsToGroceryProductsRequest,
    "MenuItem": MenuItem_1.MenuItem,
    "MenuItemServings": MenuItemServings_1.MenuItemServings,
    "ProductInformation": ProductInformation_1.ProductInformation,
    "ProductInformationCredits": ProductInformationCredits_1.ProductInformationCredits,
    "QuickAnswer200Response": QuickAnswer200Response_1.QuickAnswer200Response,
    "RecipeInformation": RecipeInformation_1.RecipeInformation,
    "RecipeInformationExtendedIngredientsInner": RecipeInformationExtendedIngredientsInner_1.RecipeInformationExtendedIngredientsInner,
    "RecipeInformationExtendedIngredientsInnerMeasures": RecipeInformationExtendedIngredientsInnerMeasures_1.RecipeInformationExtendedIngredientsInnerMeasures,
    "RecipeInformationExtendedIngredientsInnerMeasuresMetric": RecipeInformationExtendedIngredientsInnerMeasuresMetric_1.RecipeInformationExtendedIngredientsInnerMeasuresMetric,
    "RecipeInformationWinePairing": RecipeInformationWinePairing_1.RecipeInformationWinePairing,
    "RecipeInformationWinePairingProductMatchesInner": RecipeInformationWinePairingProductMatchesInner_1.RecipeInformationWinePairingProductMatchesInner,
    "SearchAllFood200Response": SearchAllFood200Response_1.SearchAllFood200Response,
    "SearchAllFood200ResponseSearchResultsInner": SearchAllFood200ResponseSearchResultsInner_1.SearchAllFood200ResponseSearchResultsInner,
    "SearchCustomFoods200Response": SearchCustomFoods200Response_1.SearchCustomFoods200Response,
    "SearchCustomFoods200ResponseCustomFoodsInner": SearchCustomFoods200ResponseCustomFoodsInner_1.SearchCustomFoods200ResponseCustomFoodsInner,
    "SearchFoodVideos200Response": SearchFoodVideos200Response_1.SearchFoodVideos200Response,
    "SearchFoodVideos200ResponseVideosInner": SearchFoodVideos200ResponseVideosInner_1.SearchFoodVideos200ResponseVideosInner,
    "SearchGroceryProducts200Response": SearchGroceryProducts200Response_1.SearchGroceryProducts200Response,
    "SearchGroceryProductsByUPC200Response": SearchGroceryProductsByUPC200Response_1.SearchGroceryProductsByUPC200Response,
    "SearchGroceryProductsByUPC200ResponseNutrition": SearchGroceryProductsByUPC200ResponseNutrition_1.SearchGroceryProductsByUPC200ResponseNutrition,
    "SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown": SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown_1.SearchGroceryProductsByUPC200ResponseNutritionCaloricBreakdown,
    "SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner": SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner_1.SearchGroceryProductsByUPC200ResponseNutritionNutrientsInner,
    "SearchGroceryProductsByUPC200ResponseServings": SearchGroceryProductsByUPC200ResponseServings_1.SearchGroceryProductsByUPC200ResponseServings,
    "SearchMenuItems200Response": SearchMenuItems200Response_1.SearchMenuItems200Response,
    "SearchRecipes200Response": SearchRecipes200Response_1.SearchRecipes200Response,
    "SearchRecipes200ResponseResultsInner": SearchRecipes200ResponseResultsInner_1.SearchRecipes200ResponseResultsInner,
    "SearchRecipesByIngredients200ResponseInner": SearchRecipesByIngredients200ResponseInner_1.SearchRecipesByIngredients200ResponseInner,
    "SearchRecipesByIngredients200ResponseInnerMissedIngredientsInner": SearchRecipesByIngredients200ResponseInnerMissedIngredientsInner_1.SearchRecipesByIngredients200ResponseInnerMissedIngredientsInner,
    "SearchRecipesByNutrients200ResponseInner": SearchRecipesByNutrients200ResponseInner_1.SearchRecipesByNutrients200ResponseInner,
    "SearchRestaurants200Response": SearchRestaurants200Response_1.SearchRestaurants200Response,
    "SearchRestaurants200ResponseRestaurantsInner": SearchRestaurants200ResponseRestaurantsInner_1.SearchRestaurants200ResponseRestaurantsInner,
    "SearchRestaurants200ResponseRestaurantsInnerAddress": SearchRestaurants200ResponseRestaurantsInnerAddress_1.SearchRestaurants200ResponseRestaurantsInnerAddress,
    "SearchRestaurants200ResponseRestaurantsInnerLocalHours": SearchRestaurants200ResponseRestaurantsInnerLocalHours_1.SearchRestaurants200ResponseRestaurantsInnerLocalHours,
    "SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational": SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational_1.SearchRestaurants200ResponseRestaurantsInnerLocalHoursOperational,
    "SearchResult": SearchResult_1.SearchResult,
    "SearchSiteContent200Response": SearchSiteContent200Response_1.SearchSiteContent200Response,
    "SummarizeRecipe200Response": SummarizeRecipe200Response_1.SummarizeRecipe200Response,
    "TalkToChatbot200Response": TalkToChatbot200Response_1.TalkToChatbot200Response,
    "TalkToChatbot200ResponseMediaInner": TalkToChatbot200ResponseMediaInner_1.TalkToChatbot200ResponseMediaInner,
    "TasteInformation": TasteInformation_1.TasteInformation,
};
var parseMimeType = function (mimeType) {
    var _a = mimeType.split('/'), type = _a[0], subtype = _a[1];
    return {
        type: type,
        subtype: subtype,
        subtypeTokens: subtype.split('+'),
    };
};
var mimeTypePredicateFactory = function (predicate) { return function (mimeType) { return predicate(parseMimeType(mimeType)); }; };
var mimeTypeSimplePredicateFactory = function (type, subtype) { return mimeTypePredicateFactory(function (descriptor) {
    if (descriptor.type !== type)
        return false;
    if (subtype != null && descriptor.subtype !== subtype)
        return false;
    return true;
}); };
var isTextLikeMimeType = mimeTypeSimplePredicateFactory('text');
var isJsonMimeType = mimeTypeSimplePredicateFactory('application', 'json');
var isJsonLikeMimeType = mimeTypePredicateFactory(function (descriptor) { return descriptor.type === 'application' && descriptor.subtypeTokens.some(function (item) { return item === 'json'; }); });
var isOctetStreamMimeType = mimeTypeSimplePredicateFactory('application', 'octet-stream');
var isFormUrlencodedMimeType = mimeTypeSimplePredicateFactory('application', 'x-www-form-urlencoded');
var supportedMimeTypePredicatesWithPriority = [
    isJsonMimeType,
    isJsonLikeMimeType,
    isTextLikeMimeType,
    isOctetStreamMimeType,
    isFormUrlencodedMimeType,
];
var ObjectSerializer = (function () {
    function ObjectSerializer() {
    }
    ObjectSerializer.findCorrectType = function (data, expectedType) {
        if (data == undefined) {
            return expectedType;
        }
        else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        }
        else if (expectedType === "Date") {
            return expectedType;
        }
        else {
            if (enumsMap.has(expectedType)) {
                return expectedType;
            }
            if (!typeMap[expectedType]) {
                return expectedType;
            }
            var discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType;
            }
            else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if (typeMap[discriminatorType]) {
                        return discriminatorType;
                    }
                    else {
                        return expectedType;
                    }
                }
                else {
                    return expectedType;
                }
            }
        }
    };
    ObjectSerializer.serialize = function (data, type, format) {
        if (data == undefined) {
            return data;
        }
        else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        }
        else if (type.lastIndexOf("Array<", 0) === 0) {
            var subType = type.replace("Array<", "");
            subType = subType.substring(0, subType.length - 1);
            var transformedData = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var date = data_1[_i];
                transformedData.push(ObjectSerializer.serialize(date, subType, format));
            }
            return transformedData;
        }
        else if (type === "Date") {
            if (format == "date") {
                var month = data.getMonth() + 1;
                month = month < 10 ? "0" + month.toString() : month.toString();
                var day = data.getDate();
                day = day < 10 ? "0" + day.toString() : day.toString();
                return data.getFullYear() + "-" + month + "-" + day;
            }
            else {
                return data.toISOString();
            }
        }
        else {
            if (enumsMap.has(type)) {
                return data;
            }
            if (!typeMap[type]) {
                return data;
            }
            type = this.findCorrectType(data, type);
            var attributeTypes = typeMap[type].getAttributeTypeMap();
            var instance = {};
            for (var _a = 0, attributeTypes_1 = attributeTypes; _a < attributeTypes_1.length; _a++) {
                var attributeType = attributeTypes_1[_a];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type, attributeType.format);
            }
            return instance;
        }
    };
    ObjectSerializer.deserialize = function (data, type, format) {
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        }
        else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        }
        else if (type.lastIndexOf("Array<", 0) === 0) {
            var subType = type.replace("Array<", "");
            subType = subType.substring(0, subType.length - 1);
            var transformedData = [];
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var date = data_2[_i];
                transformedData.push(ObjectSerializer.deserialize(date, subType, format));
            }
            return transformedData;
        }
        else if (type === "Date") {
            return new Date(data);
        }
        else {
            if (enumsMap.has(type)) {
                return data;
            }
            if (!typeMap[type]) {
                return data;
            }
            var instance = new typeMap[type]();
            var attributeTypes = typeMap[type].getAttributeTypeMap();
            for (var _a = 0, attributeTypes_2 = attributeTypes; _a < attributeTypes_2.length; _a++) {
                var attributeType = attributeTypes_2[_a];
                var value = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type, attributeType.format);
                if (value !== undefined) {
                    instance[attributeType.name] = value;
                }
            }
            return instance;
        }
    };
    ObjectSerializer.normalizeMediaType = function (mediaType) {
        if (mediaType === undefined) {
            return undefined;
        }
        return mediaType.split(";")[0].trim().toLowerCase();
    };
    ObjectSerializer.getPreferredMediaType = function (mediaTypes) {
        if (mediaTypes.length === 0) {
            return "application/json";
        }
        var normalMediaTypes = mediaTypes.map(this.normalizeMediaType);
        for (var _i = 0, supportedMimeTypePredicatesWithPriority_1 = supportedMimeTypePredicatesWithPriority; _i < supportedMimeTypePredicatesWithPriority_1.length; _i++) {
            var predicate = supportedMimeTypePredicatesWithPriority_1[_i];
            for (var _a = 0, normalMediaTypes_1 = normalMediaTypes; _a < normalMediaTypes_1.length; _a++) {
                var mediaType = normalMediaTypes_1[_a];
                if (mediaType != null && predicate(mediaType)) {
                    return mediaType;
                }
            }
        }
        throw new Error("None of the given media types are supported: " + mediaTypes.join(", "));
    };
    ObjectSerializer.stringify = function (data, mediaType) {
        if (isTextLikeMimeType(mediaType)) {
            return String(data);
        }
        if (isJsonLikeMimeType(mediaType)) {
            return JSON.stringify(data);
        }
        throw new Error("The mediaType " + mediaType + " is not supported by ObjectSerializer.stringify.");
    };
    ObjectSerializer.parse = function (rawData, mediaType) {
        if (mediaType === undefined) {
            throw new Error("Cannot parse content. No Content-Type defined.");
        }
        if (isTextLikeMimeType(mediaType)) {
            return rawData;
        }
        if (isJsonLikeMimeType(mediaType)) {
            return JSON.parse(rawData);
        }
        throw new Error("The mediaType " + mediaType + " is not supported by ObjectSerializer.parse.");
    };
    return ObjectSerializer;
}());
exports.ObjectSerializer = ObjectSerializer;
