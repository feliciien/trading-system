import axiosInstance from "../utils/axios";

const RETRY_DELAY = 5000;
const MAX_RETRIES = 3;
const BACKOFF_MULTIPLIER = 2;

export const getEquityUpdates = async (retryCount = 0) => {
  try {
    const response = await axiosInstance.get("/equity/updates");

    // Add validation
    if (!response.data) {
      console.warn("Empty equity response received");
      return 0;
    }

    // Ensure we return a number
    const equity = Number(response.data.equity);
    if (isNaN(equity)) {
      console.warn("Invalid equity value received:", response.data);
      return 0;
    }

    return equity;
  } catch (error) {
    console.error("Equity update error:", error);
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getEquityUpdates(retryCount + 1);
    }
    return 0; // Return 0 instead of throwing
  }
};
