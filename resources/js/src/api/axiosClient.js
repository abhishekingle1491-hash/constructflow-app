// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://api.constructflow.test/api',
    withCredentials: true, // <-- THIS IS THE MISSING LINE
    headers: {
        'Accept': 'application/json',
    },
});

export default axiosClient;