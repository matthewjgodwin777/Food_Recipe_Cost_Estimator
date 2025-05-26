"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
// Configure axios-retry
(0, axios_retry_1.default)(axios_1.default, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
        console.log(`Retry attempt #${retryCount}`);
        return retryCount * 1000; // Delay between retries (in ms)
    },
    retryCondition: (error) => {
        // Retry on network errors or specific HTTP status codes
        return axios_retry_1.default.isNetworkError(error) || error.response?.status === 404;
    }
});
