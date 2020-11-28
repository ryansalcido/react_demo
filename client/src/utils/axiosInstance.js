import axios from "axios";

/**
 * Setting "no-cache" headers prevents users from attempting to view
 * a protected route after logging out.
 */
const axiosInstance = axios.create({
	baseURL: process.env.NODE_ENV === "production"
		? process.env.REACT_APP_NODE_BASE_URL_PROD
		: process.env.REACT_APP_NODE_BASE_URL_DEV,
	headers: {"pragma": "no-cache", "cache-control": "no-cache"}
});

axiosInstance.CancelToken = axios.CancelToken;
axiosInstance.isCancel = axios.isCancel;

export default axiosInstance;