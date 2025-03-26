//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postJwtLogin } from "../../../helpers/fakebackend_helper";
import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(
        user.email,
        user.password
      );
    } else {
      // Use JWT authentication by default
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });
    }

    var data = await response;

    if (data) {
      if (data.status === true) {
        // Store the token and user data
        sessionStorage.setItem("authUser", JSON.stringify(data.data));
        sessionStorage.setItem("token", data.data.token);
        
        // Transform the user data to match the expected format
        const transformedData = {
          user: data.data.user,
          token: data.data.token
        };
        
        dispatch(loginSuccess(transformedData));
        history('/dashboard');
        return true; // Return true to indicate successful login
      } else {
        dispatch(apiError(data.message || "Login failed"));
        return false; // Return false to indicate failed login
      }
    }
  } catch (error) {
    let errorMessage = "An error occurred during login";
    
    // Handle different types of errors
    if (typeof error === 'object' && error !== null) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 404:
            errorMessage = "Service not found";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage = error.response.data?.message || "Server error";
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "An unexpected error occurred";
      }
    } else if (typeof error === 'string') {
      // If error is a string, use it directly
      errorMessage = error;
    }
    
    dispatch(apiError(errorMessage));
    return false; // Return false to indicate failed login
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("token");
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
      
    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};