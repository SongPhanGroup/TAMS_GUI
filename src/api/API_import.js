import axios from 'axios'
import queryString from 'query-string'
import Auth from './auth'

function getAuthToken() {
    return window.localStorage.getItem("accessToken") ?? ""
}

const REACT_APP_IMPORT = axios.create({
    baseURL: `${process.env.REACT_APP_IMPORT}/`,
    headers: {
        // 'content-type':'multipart/form-data'
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params)
})

REACT_APP_IMPORT.interceptors.request.use(async (config) => {
    //hanlde tooken...
    config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${getAuthToken()}`
    }
    return { ...config }
})

REACT_APP_IMPORT.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data
    }
    return response
}, async (error) => {
    const status = error.response ? error.response.status : null
    console.log("error", error)
    // Access Token was expired
    if (status === 401) {
        await Auth.refreshToken()
        error.config.headers['Authorization'] = `Bearer ${getAuthToken()}`
        return REACT_APP_IMPORT(error.config)
    }
    if (status === 408) {
        window.localStorage.clear()
        window.location.href = '/login'
    }
    return Promise.reject(error)
})

export { REACT_APP_IMPORT }