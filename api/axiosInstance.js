// api/axiosInstance.js
import axios from 'axios';
import API_URL  from './api_urls';
const axiosInstance = axios.create({
  baseURL: API_URL,  // Replace with your API URL
  timeout: 10000,
});

export default axiosInstance;
