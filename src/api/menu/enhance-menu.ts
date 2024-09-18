import {LOCAL_STORAGE_MENU_API_KEY, MENU_API_URL} from "@/utils/constants";

export async function enhanceMenuWithTranslationsAsync(menu: any): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const translationLanguage = encodeURIComponent(localStorage.getItem('translationLanguage') || '');
    const response = await fetch(`${MENU_API_URL}/menu/enhance/with-translations?async=true&language=${translationLanguage}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menu)
    });
    const data = await response.json();
    return data.jobId;
}

export async function enhanceMenuWithImagesAsync(menu: any): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(`${MENU_API_URL}/menu/enhance/with-images?async=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menu)
    });
    const data = await response.json();
    return data.jobId;
}

export async function enhanceMenuWithCuisineAsync(menu: any): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(`${MENU_API_URL}/menu/enhance/with-cuisine?async=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menu)
    });
    const data = await response.json();
    return data.jobId;
}

export async function enhanceMenuWithDescriptionsAsync(menu: any): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(`${MENU_API_URL}/menu/enhance/with-descriptions?async=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menu)
    });
    const data = await response.json();
    return data.jobId;
}

export async function enhanceMenuWithDietaryLabelsAsync(menu: any): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(`${MENU_API_URL}/menu/enhance/with-dietary-labels?async=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menu)
    });
    const data = await response.json();
    return data.jobId;
}
