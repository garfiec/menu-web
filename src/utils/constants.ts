export const MENU_API_URL = import.meta.env.VITE_MENU_API_URL
export const MENU_APP_NAME = import.meta.env.VITE_MENU_APP_NAME

// Local Storage Keys
export const LOCAL_STORAGE_COMPLETED_FIRST_SETUP = 'completedFirstSetup'
export const LOCAL_STORAGE_MENU_API_KEY = 'menuApiKey'
export const LOCAL_STORAGE_RESTAURANTS_CATALOG = 'restaurantsCatalog'
export const LOCAL_STORAGE_OCR_LANGUAGES = 'ocrLanguages'
export const LOCAL_STORAGE_ENHANCEMENT_PREFERENCES = 'enhancementPreferences'
export const LOCAL_STORAGE_TRANSLATION_LANGUAGE = 'translationLanguage'

// Supported Enhancement Types
export const ENHANCEMENT_TYPE_WITH_TRANSLATIONS = 'with-translations'
export const ENHANCEMENT_TYPE_WITH_CUISINE = 'with-cuisine';
export const ENHANCEMENT_TYPE_WITH_IMAGES = 'with-images';
export const ENHANCEMENT_TYPE_WITH_DESCRIPTIONS = 'with-descriptions';
export const ENHANCEMENT_TYPE_WITH_DIETARY_LABELS = 'with-dietary-labels';

// Settings
export const SETTINGS_DEFAULT_OCR_LANGUAGES = JSON.stringify(['eng']);
export const SETTINGS_DEFAULT_ENHANCEMENT_PREFERENCES = JSON.stringify([ENHANCEMENT_TYPE_WITH_CUISINE, ENHANCEMENT_TYPE_WITH_IMAGES]);
export const SETTINGS_DEFAULT_TRANSLATION_LANGUAGE = 'English';

export const SUPPORTED_TRANSLATION_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Korean', 'Vietnamese', 'Thai'];
export const OCR_LANGUAGES = [
    { name: 'English', code: 'eng' },
    { name: 'Spanish', code: 'spa' },
    { name: 'French', code: 'fra' },
    { name: 'German', code: 'deu' },
    { name: 'Italian', code: 'ita' },
    { name: 'Japanese', code: 'jpn' },
    { name: 'Chinese Simplified', code: 'chi_sim' },
    { name: 'Chinese Traditional', code: 'chi_tra' },
    { name: 'Korean', code: 'kor' },
    { name: 'Vietnamese', code: 'vie' },
    { name: 'Thai', code: 'tha' },
];

// Requests
export const RETRY_ATTEMPTS = 5;