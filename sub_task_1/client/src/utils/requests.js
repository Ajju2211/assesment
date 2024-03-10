import axios from "axios";

export async function doRequest(url, method, data = {}, headers=undefined) {
    try {
        const response = await axios({
            method,
            url,
            data,
            headers
        });

        return {
            error: null,
            response: response.data,
            statusCode: response.statusCode
        };
    } catch (error) {
        const errMsg = error?.response?.data?.message  || error?.message || error?.response?.statusText || error.code;
        return {
            error: errMsg,
            response: null,
            statusCode: error?.response?.status || 500
        };
    }
}