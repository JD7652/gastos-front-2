import axios from 'axios';

const api = axios.create({
    baseURL: "http://Nest-gaelo-eb-env.eba-hzaz3hry.us-east-1.elasticbeanstalk.com/api", 
    headers: {
    "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

