import axios from "axios";
import { api } from "../config";
import axiosRetry from 'axios-retry';

// default
axios.defaults.baseURL = "https://aaurms.eotcssu.et/api";
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
// timeout
axios.defaults.timeout = 30000; // 30 seconds timeout

// Configure retry logic
axiosRetry(axios, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
  }
});

// Add request interceptor to set the token for every request
axios.interceptors.request.use(function (config) {
  // Get the latest token from sessionStorage before each request
  const authUser = sessionStorage.getItem("authUser");
  const token = authUser ? JSON.parse(authUser).token : sessionStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Setting auth token for request to: " + config.url, token.substring(0, 10) + "...");
    console.log("Full URL being requested:", config.baseURL + config.url);
  } else {
    console.warn("No auth token found for request to: " + config.url);
  }
  
  return config;
}, function (error) {
  return Promise.reject(error);
});

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    // Don't transform the response, return it as-is so we can handle status and data properly
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    
    if (error.code === 'ECONNABORTED') {
      message = "Connection timed out. Please check your internet connection and try again.";
    } else if (!error.response) {
      // Network error
      message = "Network error. Please check your internet connection.";
    } else {
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url
      });
      
      switch (error.response.status) {
        case 500:
          message = "Internal Server Error";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        case 404:
          message = "Sorry! the data you are looking for could not be found";
          break;
        default:
          message = error.response.data?.message || error.message || "An error occurred";
      }
    }
    // Return the original error with additional message property
    error.message = message;
    return Promise.reject(error);
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response.then(res => {
      // Ensure we return the data property from the response
      return res.data || res;
    });
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data).then(res => {
      return res.data || res;
    });
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.put(url, data).then(res => {
      return res.data || res;
    });
  };
  /**
   * Updates data with PATCH
   */
  patch = (url, data) => {
    console.log(`PATCH request to ${url}:`, data);
    return axios.patch(url, data)
      .then(res => {
        console.log(`PATCH response from ${url}:`, res.data);
        return res.data || res;
      })
      .catch(error => {
        console.error(`PATCH error for ${url}:`, error.response || error);
        throw error;
      });
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config }).then(res => {
      return res.data || res;
    });
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

const getToken = () => {
  const user = getLoggedinUser();
  return user ? user.token : null;
};

export { APIClient, setAuthorization, getLoggedinUser, getToken };