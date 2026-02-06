import axios, { AxiosError } from 'axios';

const httpService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const unsecureHttpService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

unsecureHttpService.interceptors.response.use((data) => {
    return data;
}, async (error: AxiosError<any, unknown>) => {
    return Promise.reject(error);
});

httpService.interceptors.request.use(async (config) => {
    const tptoken = localStorage.getItem('tp_token')
    const token = localStorage.getItem('token')

    if (config.data instanceof FormData) {
        console.log('ITS FORMDATA');
        config.headers['Content-Type'] = 'multipart/form-data'
        if (token === null || token === undefined) {
            return config;
        }
        config.headers['authorization'] = `Bearer ${token}`;

        return config;
    } else {
        config.headers['Content-Type'] = 'application/json';

        if (token && token !== null && token !== undefined) {
            config.headers['authorization'] = `Bearer ${(token && token !== null) ? token : tptoken}`;
            return config;
        } else if (tptoken && tptoken !== null && tptoken !== undefined) {
            config.headers['authorization'] = `Bearer ${tptoken}`;
            return config
        }

        return config;
    }


}, error => {
    return Promise.reject(error)
});

httpService.interceptors.response.use((data) => {
    return data;
}, async (error: AxiosError<any, unknown>) => {
    // return Promise.reject(error);
    if (!error.response) {
        return Promise.reject(error);
    } else {
        if (error.response?.data instanceof Array) {
            return Promise.reject(JSON.stringify(error.response?.data));
        } else if (error.response?.data instanceof Object) {
            return Promise.reject(error.response?.data.message);
        }
        else {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.setItem('token', '');
            }
            return Promise.reject(error.response?.data.message);
        }
    }
});

export default httpService;
