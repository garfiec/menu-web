import {defineStore} from "pinia";
import {
    LOCAL_STORAGE_ENHANCEMENT_PREFERENCES,
    LOCAL_STORAGE_MENU_API_KEY, LOCAL_STORAGE_OCR_LANGUAGES,
    LOCAL_STORAGE_TRANSLATION_LANGUAGE
} from "@/utils/constants";
import {verifyAndGetUser} from "@/api/menu/user";

export const useSettingsStore = defineStore('useSettingsStore', {
    state: () => ({
        menuApiKey: '',
        apiKeyIcon: 'mdi-alert-circle',
        apiKeyIconColor: 'error',
        selectedOcrLanguages: [],
        selectedEnhancements: [],
        selectedLanguage: 'English',
        showSettingsClearedSnackbar: false
    }),
    actions: {
        init() {
            this.menuApiKey = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY) || '';
            verifyAndGetUser().then(this.handleVerifiedApiKey);
            this.selectedOcrLanguages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_OCR_LANGUAGES) || '[]');
            this.selectedEnhancements = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENHANCEMENT_PREFERENCES) || '[]');
            this.selectedLanguage = localStorage.getItem(LOCAL_STORAGE_TRANSLATION_LANGUAGE) || '';
        },
        onMenuApiKeyChanged(menuApiKey: string) {
            localStorage.setItem(LOCAL_STORAGE_MENU_API_KEY, menuApiKey);
            verifyAndGetUser().then(this.handleVerifiedApiKey);
        },
        onSelectedOcrLanguagesChanged(selectedOcrLanguages: string[]) {
            localStorage.setItem(LOCAL_STORAGE_OCR_LANGUAGES, JSON.stringify(selectedOcrLanguages));
        },
        onSelectedEnhancementsChanged(selectedEnhancements: string[]) {
            localStorage.setItem(LOCAL_STORAGE_ENHANCEMENT_PREFERENCES, JSON.stringify(selectedEnhancements));
        },
        onSelectedLanguageChanged(selectedLanguage: string) {
            console.log('Selected language changed to: ' + selectedLanguage);
            localStorage.setItem(LOCAL_STORAGE_TRANSLATION_LANGUAGE, selectedLanguage);
        },
        handleVerifiedApiKey(username: string | null) {
            if (username) {
                this.apiKeyIcon = 'mdi-check-circle';
                this.apiKeyIconColor = 'success';
                localStorage.setItem('username', username);
            } else {
                this.apiKeyIcon = 'mdi-alert-circle';
                this.apiKeyIconColor = 'error';
                localStorage.removeItem('username');
            }
        },
        clearStorage() {
            // Clear everything except for the API key
            const apiKey = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY) || '';
            localStorage.clear();
            localStorage.setItem(LOCAL_STORAGE_MENU_API_KEY, apiKey);
            this.showSettingsClearedSnackbar = true;

            // Provide initial settings
            window.location.reload();
        }
    }
});
