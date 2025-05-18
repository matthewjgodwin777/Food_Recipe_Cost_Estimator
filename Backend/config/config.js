const axios = require("axios");
const axiosRetry = require("axios-retry");

// Configure axios-retry
axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
        console.log(`Retry attempt #${retryCount}`);
        return retryCount * 1000; // Delay between retries (in ms)
    },
    retryCondition: (error) => {
        // Retry on network errors or specific HTTP status codes
        return axiosRetry.isNetworkError(error) || error.response?.status === 404;
    }
});