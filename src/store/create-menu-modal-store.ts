import {defineStore} from "pinia";
import {
    ENHANCEMENT_TYPE_WITH_CUISINE, ENHANCEMENT_TYPE_WITH_DESCRIPTIONS, ENHANCEMENT_TYPE_WITH_DIETARY_LABELS,
    ENHANCEMENT_TYPE_WITH_IMAGES, ENHANCEMENT_TYPE_WITH_TRANSLATIONS, LOCAL_STORAGE_ENHANCEMENT_PREFERENCES,
    LOCAL_STORAGE_RESTAURANTS_CATALOG, RETRY_ATTEMPTS
} from "@/utils/constants";
import {v4} from 'uuid';
import {subscribeToMenuJobUpdates} from "@/api/menu/sse";
import type {ProgressUpdate} from "@/models/progress-tracking";
import {fetchMenuAsyncJobResult} from "@/api/menu/async-job";
import {
    fetchMenuFromPdfAsync,
    fetchMenuFromPhotosAsync,
    fetchMenuFromTextAsync,
    fetchMenuFromUrlAsync
} from "@/api/menu/create-menu";
import {
    type Restaurant
} from "@/models/restaurant";
import {navigateToRestaurant} from "@/routes/route-functions";
import {retryAsync} from "@/api/util/retry";

async function addRestaurantMenu(restaurantName: string, cuisine: string, menu: any): Promise<string> {
    const restaurantCatalogString = localStorage.getItem(LOCAL_STORAGE_RESTAURANTS_CATALOG);
    const restaurantCatalog = restaurantCatalogString ? JSON.parse(restaurantCatalogString) : {};
    const restaurantId = v4();

    // Add the new restaurant to the restaurant catalog
    restaurantCatalog[restaurantId] = {
        restaurantName: restaurantName,
        restaurantId: restaurantId,
    }

    // Load enhancement preferences
    const enhancementPreferences = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENHANCEMENT_PREFERENCES) || '[]');
    const enhancements = {
        [ENHANCEMENT_TYPE_WITH_TRANSLATIONS]: { shouldRefresh: enhancementPreferences.includes('with-translations'), jobId: '' },
        [ENHANCEMENT_TYPE_WITH_CUISINE]: { shouldRefresh: cuisine.trim() === '' && enhancementPreferences.includes('with-cuisine'), jobId: '' },
        [ENHANCEMENT_TYPE_WITH_IMAGES]: { shouldRefresh: enhancementPreferences.includes('with-images'), jobId: '' },
        [ENHANCEMENT_TYPE_WITH_DESCRIPTIONS]: { shouldRefresh: enhancementPreferences.includes('with-descriptions'), jobId: '' },
        [ENHANCEMENT_TYPE_WITH_DIETARY_LABELS]: { shouldRefresh: enhancementPreferences.includes('with-dietary-labels'), jobId: '' },
    };

    // Add initial restaurant details
    const restaurantJson: Restaurant = {
        restaurantName: restaurantName,
        menu: {
            ...menu,
            restaurantInfo: {
                cuisine: cuisine
            }
        },
        metadata: {},
        enhancements: enhancements
    };

    // Save it back to local storage
    localStorage.setItem(LOCAL_STORAGE_RESTAURANTS_CATALOG, JSON.stringify(restaurantCatalog));
    localStorage.setItem(restaurantId, JSON.stringify(restaurantJson));

    return restaurantId;
}

export const useCreateMenuModalStore = defineStore('createMenuModalStore', {
    state: () => ({
        tab: 'url',
        restaurantNameInput: '',
        restaurantNameInputIcon: '',
        cuisineInput: '',
        urlInput: '',
        urlInputIcon: '',
        filesInput: [] as File[],
        textInput: '',
        isLoading: false,
        loadingProgress: 0,
        shouldShowSnackbar: false,
        snackbarText: ''
    }),
    actions: {
        showSnackbar(text: string) {
            this.snackbarText = text;
            this.shouldShowSnackbar = true;
        },
        handleRestaurantInputChange() {
            this.restaurantNameInputIcon = this.restaurantNameInput === '' ? 'mdi-alert-circle-outline' : '';
        },
        clearInputs() {
            this.restaurantNameInput = '';
            this.cuisineInput = '';
            this.urlInput = '';
            this.filesInput = [];
            this.textInput = '';
            this.isLoading = false;
            this.loadingProgress = 0;
        },
        async handleAsyncJobUpdates(data: ProgressUpdate) {
            this.loadingProgress = (100 * data.overallProgress.currentStep / data.overallProgress.totalSteps);
        },
        async createMenuFromUrl() {
            console.log(`Creating menu from URL: ${this.urlInput}`);
            await this.createMenuCommon(fetchMenuFromUrlAsync, this.urlInput);
        },
        async createMenuFromUpload() {
            const isImages = this.filesInput.every(file => file.type.startsWith('image'));
            const isPdf = this.filesInput.length === 1 && this.filesInput[0].type === 'application/pdf';
            if (isImages) {
                await this.createMenuCommon(fetchMenuFromPhotosAsync, this.filesInput);
            } else if (isPdf) {
                await this.createMenuCommon(fetchMenuFromPdfAsync, this.filesInput[0]); // TODO, we need better handling than just take the first file
            } else {
                throw new Error('Unsupported file type');
            }
        },
        async createMenuFromText() {
            console.log(`Creating menu from text: ${this.textInput}`);
            await this.createMenuCommon(fetchMenuFromTextAsync, this.textInput);
        },
        async createMenuCommon(fetchMenuFunction: Function, ...fetchMenuArgs: any[]) {
            const jobId = await fetchMenuFunction(...fetchMenuArgs);
            const closeSubscription = subscribeToMenuJobUpdates(jobId, this.handleAsyncJobUpdates);
            const menu = await retryAsync(() => fetchMenuAsyncJobResult(jobId), RETRY_ATTEMPTS);
            closeSubscription();
            const restaurantId = await addRestaurantMenu(this.restaurantNameInput, this.cuisineInput, menu);
            await navigateToRestaurant(restaurantId);
            this.showSnackbar('Menu created successfully');
        },
        async createMenu() {
            this.isLoading = true;
            if (this.restaurantNameInput === '') {
                // Alert that restaurant name is required
                this.showSnackbar('Restaurant name is required');
                this.isLoading = false;
                return;
            }

            try {
                if (this.tab === 'url') {
                    if (this.urlInput === '') {
                        this.showSnackbar('URL is required');
                        this.isLoading = false;
                        return;
                    }
                    await this.createMenuFromUrl();
                } else if (this.tab === 'upload') {
                    if (this.filesInput.length === 0) {
                        this.showSnackbar('Files are required');
                        this.isLoading = false;
                        return;
                    }
                    await this.createMenuFromUpload();
                } else if (this.tab === 'text') {
                    if (this.textInput === '') {
                        this.showSnackbar('Text is required');
                        this.isLoading = false;
                        return;
                    }
                    await this.createMenuFromText();
                }
                this.clearInputs();
            } catch (error) {
                this.showSnackbar(`Error creating menu. ${error}`);
                console.error('Error creating menu:', error);
                this.isLoading = false;
            }

        }
    }
})
