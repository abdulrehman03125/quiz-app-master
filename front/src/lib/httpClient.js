import axios from "axios";
import { store } from "../store/store"; 

// Create Axios instance
export const httpClient = axios.create({
  baseURL: "http://localhost:3007",
  timeout: 5000,
});

// Add a request interceptor
httpClient.interceptors.request.use(
  function (config) {
    // Access the Redux store to get the access token
    const state = store.getState(); 
    const token = state.authSlice?.accessToken; 
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  function (error) {

    return Promise.reject(error);
  }
);
