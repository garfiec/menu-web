import {MENU_API_URL} from "@/utils/constants";
import type {ProgressUpdate} from "@/models/progress-tracking";

/**
 * Subscribes to server-sent events (SSE) from menu job updates.
 * @param jobId The job ID to subscribe to.
 * @param onUpdate A callback function that is triggered with the event data.
 */
export function subscribeToMenuJobUpdates(jobId: string, onUpdate: (data: ProgressUpdate) => void): () => void {
    const url = `${MENU_API_URL}/menu/job/updates/${jobId}?sse=true&skipType=true`;
    let eventSource = new EventSource(url);

    const setupEventSource = () => {
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = (error) => {
            console.error('Error with SSE connection. Retrying after 3s.', error);
            eventSource.close();
            // Attempt to reconnect after a delay
            setTimeout(() => {
                eventSource = new EventSource(url);
                setupEventSource();
            }, 3000); // 3 seconds delay before reconnecting
        };
    };

    setupEventSource();

    // Provide a way to close the connection when it's no longer needed
    const closeConnection = () => {
        eventSource.close();
    };

    // Return the close function in case manual control is needed
    return closeConnection;
}
