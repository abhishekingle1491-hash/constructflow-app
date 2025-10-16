import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://api.constructflow.test/api', // Use environment variables for production
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

export default axiosClient;