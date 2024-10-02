import axios from "axios";

const axiosRequest = axios.create({
    baseURL:"/api",
    withCredentials:true
});

export default axiosRequest;