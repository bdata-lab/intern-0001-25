import axios from 'axios';

// Function to create an axios instance with dynamic Content-Type
const createApiClient = (baseURL) => {
  const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });

  // Response interceptor for error handling and returning data.data
  apiClient.interceptors.response.use(
    (response) => {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log("Response:", response.data);
      // }
      return response.data; // Directly return response.data
    },
    (error) => handleGlobalError(error)
  );

  return apiClient;
};

// Handle API errors
function handleGlobalError(error) {
  const { response, request, message } = error;
  if (response) {
    const { status, data } = response;
    const errorMessage = data?.message || 'An error occurred';
    throw new Error(`${status}: ${errorMessage}`);
  }
  if (request) {
    throw new Error('No response from server');
  }
  throw new Error(message || 'Error setting up request');
}

// Create and export the API client instance
const apiClient = createApiClient(_API_URL_);
export { apiClient };
