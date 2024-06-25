import axios from 'axios'
// import queryString from 'query-string'
import Auth from './auth'
import { parse, stringify } from 'qs'
function getAuthToken() {
    return window.localStorage.getItem("accessToken") ?? ""
}

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL_NEW}`,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: {
        encode: parse,
        serialize: stringify
    }
})

API.interceptors.request.use(async (config) => {
    config.headers = {
        ...(config.headers ?? {})
    }
    return { ...config }
})

API.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data
    }

    return response
}, (error) => {
    const status = error.response ? error.response.status : null
    // console.log("error", error)
    // Access Token was expired
    if (status === 401) {
        return Auth.refreshToken().then(() => {
            error.config.headers['Authorization'] = `Bearer ${getAuthToken()}`
            return API(error.config)
        })
    }
    if (status === 408) {
        window.localStorage.clear()
        window.location.href = '/login'
    }
    return error
})

export { API }