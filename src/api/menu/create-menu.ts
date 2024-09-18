import {LOCAL_STORAGE_MENU_API_KEY, LOCAL_STORAGE_OCR_LANGUAGES, MENU_API_URL} from "@/utils/constants";

export async function fetchMenuFromTextAsync(textInput: string): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(`${MENU_API_URL}/menu/create/from-text?async=true`, {
        method: 'POST',
        body: textInput,
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data.jobId);
    return data.jobId;
}

export async function fetchMenuFromUrlAsync(urlInput: string): Promise<string> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const ocrLanguages = localStorage.getItem(LOCAL_STORAGE_OCR_LANGUAGES) || '';
    const url = new URL(`${MENU_API_URL}/menu/create/from-url`);
    const params = new URLSearchParams({ url: urlInput, async: 'true', ocrLanguages: ocrLanguages });
    url.search = params.toString();

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data.jobId);
    return data.jobId;
}

export async function fetchMenuFromPhotosAsync(filesInput: File[]): Promise<string> {
    const formData = new FormData();
    filesInput.forEach(file => {
        formData.append('photos', file);
    });
    const ocrLanguages = localStorage.getItem(LOCAL_STORAGE_OCR_LANGUAGES) || '';
    const url = new URL(`${MENU_API_URL}/menu/create/from-photos`);
    const params = new URLSearchParams({ async: 'true', ocrLanguages: ocrLanguages });
    url.search = params.toString();

    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data.jobId);
    return data.jobId;
}

export async function fetchMenuFromPdfAsync(fileInput: File): Promise<string> {
    const formData = new FormData();
    formData.append('pdf', fileInput);
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const ocrLanguages = localStorage.getItem(LOCAL_STORAGE_OCR_LANGUAGES) || '';
    const url = new URL(`${MENU_API_URL}/menu/create/from-pdf`);
    const params = new URLSearchParams({ async: 'true', ocrLanguages: ocrLanguages });
    url.search = params.toString();

    const response = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data.jobId);
    return data.jobId;
}
