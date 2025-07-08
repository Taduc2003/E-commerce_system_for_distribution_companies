import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Bạn có thể thêm các cấu hình khác ở đây
});

export default axiosInstance;