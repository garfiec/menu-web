import {LOCAL_STORAGE_MENU_API_KEY, MENU_API_URL} from "@/utils/constants";

export async function fetchMenuAsyncJobResult(jobId: string): Promise<any> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    const response = await fetch(`${MENU_API_URL}/menu/job/result/${jobId}?wait=true`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    console.log(data);
    return data;
}

export async function checkIfJobExists(jobId: string): Promise<boolean> {
    const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
    try {
        const response = await fetch(`${MENU_API_URL}/menu/job/updates/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error("Failed to check if job exists:", error);
        return false;
    }
}
