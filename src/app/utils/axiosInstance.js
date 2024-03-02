import axios from 'axios';

const Base_URL = 'https://server-84yt.onrender.com/api/v1';

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = Base_URL;
axiosInstance.defaults.withCredentials = true; //* With credentials is set to true so that cookies and authentication headers will be sent with each request.

export default axiosInstance;
