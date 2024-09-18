import {defineStore} from "pinia";
import type {MenuSectionUiModel} from "@/components/menu/section/menu-section-ui-model";
import type {DishCardUiModel} from "@/components/menu/dish/dish-card-ui-model";
import {subscribeToMenuJobUpdates} from "@/api/menu/sse";
import type {ProgressUpdate} from "@/models/progress-tracking";
import {checkIfJobExists, fetchMenuAsyncJobResult} from "@/api/menu/async-job";
import {
    type Restaurant
} from "@/models/restaurant";
import {
    enhanceMenuWithCuisineAsync,
    enhanceMenuWithDescriptionsAsync, enhanceMenuWithDietaryLabelsAsync,
    enhanceMenuWithImagesAsync, enhanceMenuWithTranslationsAsync
} from "@/api/menu/enhance-menu";
import {
    ENHANCEMENT_TYPE_WITH_CUISINE,
    ENHANCEMENT_TYPE_WITH_DESCRIPTIONS,
    ENHANCEMENT_TYPE_WITH_DIETARY_LABELS,
    ENHANCEMENT_TYPE_WITH_IMAGES, ENHANCEMENT_TYPE_WITH_TRANSLATIONS, RETRY_ATTEMPTS
} from "@/utils/constants";
import {retryAsync} from "@/api/util/retry";

export const useRestaurantMenuStore = defineStore('useRestaurantMenuStore', {
    state: () => ({
        restaurantId: '',
        restaurantName: '',
        menuSections: [] as MenuSectionUiModel[],
        isLoadingEnhancements: false,
        enhancementLoadingDescription: '',
        enhancementLoadingIcon: '',
        enhancementLoadingProgress: 0,
        enhancementSpeedDialDisabled: true,
    }),
    actions: {
        async init(restaurantId: string) {
            this.enhancementSpeedDialDisabled = true;
            const restaurantJson = localStorage.getItem(restaurantId);
            if (restaurantJson) {
                let restaurant: Restaurant = JSON.parse(restaurantJson);
                this.loadRestaurantUi(restaurantId, restaurant);

                for (const enhancementKey in restaurant.enhancements) {
                    const enhancement = restaurant.enhancements[enhancementKey];
                    if (enhancement && enhancement.shouldRefresh) {
                        console.log(`Enhancement type: ${enhancementKey} ${enhancement?.jobId} ${enhancement?.shouldRefresh}`);
                        switch (enhancementKey) {
                            case ENHANCEMENT_TYPE_WITH_TRANSLATIONS:
                                console.log('Enhancing with translations');
                                await this.processEnrichmentRequest({
                                    restaurantId: restaurantId,
                                    restaurant: restaurant,
                                    enhancementType: ENHANCEMENT_TYPE_WITH_TRANSLATIONS,
                                    enhanceMenuAsyncFunction: enhanceMenuWithTranslationsAsync,
                                    loadingDescription: 'Enhancing menu with translations.',
                                    loadingIcon: 'mdi-translate',
                                });
                                break;
                            case ENHANCEMENT_TYPE_WITH_CUISINE:
                                console.log('Enhancing with cuisine');
                                await this.processEnrichmentRequest({
                                    restaurantId: restaurantId,
                                    restaurant: restaurant,
                                    enhancementType: ENHANCEMENT_TYPE_WITH_CUISINE,
                                    enhanceMenuAsyncFunction: enhanceMenuWithCuisineAsync,
                                    loadingDescription: 'Enhancing menu with cuisine.',
                                    loadingIcon: 'mdi-earth',
                                });
                                break;
                            case ENHANCEMENT_TYPE_WITH_IMAGES:
                                console.log('Enhancing with images');
                                await this.processEnrichmentRequest({
                                    restaurantId: restaurantId,
                                    restaurant: restaurant,
                                    enhancementType: ENHANCEMENT_TYPE_WITH_IMAGES,
                                    enhanceMenuAsyncFunction: enhanceMenuWithImagesAsync,
                                    loadingDescription: 'Enhancing menu with images.',
                                    loadingIcon: 'mdi-image',
                                });
                                break;
                            case ENHANCEMENT_TYPE_WITH_DESCRIPTIONS:
                                console.log('Enhancing with descriptions');
                                await this.processEnrichmentRequest({
                                    restaurantId: restaurantId,
                                    restaurant: restaurant,
                                    enhancementType: ENHANCEMENT_TYPE_WITH_DESCRIPTIONS,
                                    enhanceMenuAsyncFunction: enhanceMenuWithDescriptionsAsync,
                                    loadingDescription: 'Enhancing menu with descriptions.',
                                    loadingIcon: 'mdi-pen',
                                });
                                break;
                            case ENHANCEMENT_TYPE_WITH_DIETARY_LABELS:
                                console.log('Enhancing with dietary labels');
                                await this.processEnrichmentRequest({
                                    restaurantId: restaurantId,
                                    restaurant: restaurant,
                                    enhancementType: ENHANCEMENT_TYPE_WITH_DIETARY_LABELS,
                                    enhanceMenuAsyncFunction: enhanceMenuWithDietaryLabelsAsync,
                                    loadingDescription: 'Enhancing menu with dietary labels.',
                                    loadingIcon: 'mdi-format-list-checks',
                                });
                                break;
                            default:
                                console.error(`Unknown enhancement type: ${enhancementKey}`);
                        }
                    }
                }
            }
            this.enhancementSpeedDialDisabled = false;
        },
        async addEnhancement(enhancementType: string) {
            const restaurantJson = localStorage.getItem(this.restaurantId);
            if (restaurantJson) {
                let restaurant: Restaurant = JSON.parse(restaurantJson);
                const enhancementSettings = restaurant.enhancements[enhancementType] ?? { shouldRefresh: true, jobId: '' };
                enhancementSettings.shouldRefresh = true;
                restaurant.enhancements[enhancementType] = enhancementSettings;
                localStorage.setItem(this.restaurantId, JSON.stringify(restaurant));
            }
            await this.init(this.restaurantId);
        },
        async processEnrichmentRequest(
            {
                restaurantId,
                restaurant,
                enhancementType,
                enhanceMenuAsyncFunction,
                loadingDescription,
                loadingIcon,
            }: {
            restaurantId: string;
            restaurant: Restaurant;
            enhancementType: string;
            enhanceMenuAsyncFunction: (menu: any) => Promise<string>;
            loadingDescription: string;
            loadingIcon: string;
        }) {
            // Get the job id if it exists. If not, then create a new job
            const existingJobId = restaurant.enhancements[enhancementType]?.jobId;
            let jobId = '';
            if (!existingJobId) {
                jobId = await enhanceMenuAsyncFunction(restaurant.menu);
            } else {
                if (await checkIfJobExists(existingJobId)) {
                    jobId = existingJobId
                } else {
                    jobId = await enhanceMenuAsyncFunction(restaurant.menu);
                }
            }

            this.isLoadingEnhancements = true;
            this.enhancementLoadingDescription = `Menu Enhancements loading. ${loadingDescription}`;
            this.enhancementLoadingIcon = loadingIcon;
            this.enhancementLoadingProgress = 0;

            // Update job id in local storage
            restaurant.enhancements[enhancementType] = { jobId: jobId, shouldRefresh: true };
            localStorage.setItem(restaurantId, JSON.stringify(restaurant));

            // Subscribe to job updates
            const closeSubscription = subscribeToMenuJobUpdates(jobId, (progressUpdate: ProgressUpdate) => {
                this.enhancementLoadingProgress = 100 * progressUpdate.overallProgress.currentStep / progressUpdate.overallProgress.totalSteps;
            });
            const menuWithEnhancements = await retryAsync(() => fetchMenuAsyncJobResult(jobId), RETRY_ATTEMPTS);
            closeSubscription();

            // Update the restaurant with the enhanced menu
            restaurant.menu = menuWithEnhancements;
            console.log('Enhanced menu', menuWithEnhancements);
            restaurant.enhancements[enhancementType] = { jobId: '', shouldRefresh: false };
            localStorage.setItem(restaurantId, JSON.stringify(restaurant));

            // Load the updated UI
            this.loadRestaurantUi(restaurantId, restaurant);
            this.isLoadingEnhancements = false;
        },
        loadRestaurantUi(restaurantId: string, restaurant: Restaurant) {
            this.menuSections = [];
            const cuisine = restaurant.menu.restaurantInfo?.cuisine;
            if (cuisine) {
                this.restaurantName = `${restaurant.restaurantName} • ${cuisine} Cuisine`;
            } else {
                this.restaurantName = restaurant.restaurantName;
            }

            const menuSections = restaurant.menu.sections;

            for (const section in menuSections) {
                const menuItems = menuSections[section];
                const dishesUiModel: DishCardUiModel[] = menuItems.map((item: any) => {
                    const dishName = item.translatedDish && item.dish !== item.translatedDish ? `${item.dish} (${item.translatedDish})` : item.dish;
                    const metadata = item.translatedMetadata ? item.translatedMetadata : item.metadata;
                    return {
                        name: dishName,
                        price: item.price,
                        description: metadata,
                        images: item.images ?? [],
                        aboutDish: item.description,
                        dietaryLabels: item.dietaryLabels
                    }
                })

                const menuSectionUiModel: MenuSectionUiModel = {
                    name: section,
                    dishes: dishesUiModel
                }

                this.menuSections.push(menuSectionUiModel);
            }
        }
    }
})
