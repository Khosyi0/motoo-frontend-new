import Axios from 'axios';

const instance = Axios.create({
	baseURL: "http://127.0.0.1:8000/api",
	withCredentials: true,
	timeout: 60000,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});  
 

export default instance;
