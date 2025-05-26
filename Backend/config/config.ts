import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

// Configure axios-retry
axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount: number) => {
        console.log(`Retry attempt #${retryCount}`);
        return retryCount * 1000; // Delay between retries (in ms)
    },
    retryCondition: (error: AxiosError) => {
        // Retry on network errors or specific HTTP status codes
        return axiosRetry.isNetworkError(error) || error.response?.status === 404;
    }
});