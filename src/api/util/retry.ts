export async function retryAsync<T>(fn: () => Promise<T>, retries: number): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`Error in retryAsync: ${error}. Attempts left: ${retries - i - 1}. Retrying...`);
            if (i === retries - 1) {
                throw error;
            }
        }
    }
    throw new Error(`Failed to perform operation after ${retries} retries.`);
}
