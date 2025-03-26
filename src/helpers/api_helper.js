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

// content type
const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
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
    return Promise.reject(message);
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

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
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

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    axios.defaults.headers.common["Authorization"] = null;
    return null;
  } else {
    const parsedUser = JSON.parse(user);
    if (parsedUser.token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + parsedUser.token;
    }
    return parsedUser;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };