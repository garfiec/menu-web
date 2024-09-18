import {LOCAL_STORAGE_MENU_API_KEY, MENU_API_URL} from "@/utils/constants";

export async function verifyAndGetUser(): Promise<string | null> {
    try {
        const token = localStorage.getItem(LOCAL_STORAGE_MENU_API_KEY);
        const response = await fetch(`${MENU_API_URL}/verify-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.username;
    } catch (error) {
        return null;
    }
}
