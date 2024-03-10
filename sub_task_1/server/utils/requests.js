import axios from "axios";

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

/**
 * @typedef {Object} RequestResult
 * @property {String|null} error - The error message, if any.
 * @property {Object|null} response - The response data as an object, if the request is successful.
 * @property {number} statusCode - The statusCode of the request executed.
 */

/**
 * Enum representing HTTP methods.
 * @enum {string}
 */
const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

/**
 * Make an HTTP request.
 *
 * @param {string} url - URL to make request to.
 * @param {HttpMethod} method - HTTP method (like HttpMethod.GET, HttpMethod.POST).
 * @param {Object} [data] - The data to send with the request (for 'POST' and 'PUT' requests).
 * @param {Object} [headers|null] - The headers to send with the request.
 * @returns {Promise<RequestResult>} - A Promise resolving to the result of the request.
 */
async function doRequest(url, method, data = {}, headers=undefined) {
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
        const errMsg = error?.response?.statusText || error?.message || error.code;
        return {
            error: errMsg,
            response: null,
            statusCode: error?.response?.status || 500
        };
    }
}

if(process.env.DEBUG_MODE=='yes'){
    axios.interceptors.request.use(request => {
        console.log('Starting Request', JSON.stringify(request, null, 2))
        return request
    })

    axios.interceptors.response.use(response => {
        console.log('Response:', JSON.stringify(response, null, 2))
        return response
    })
}

export default {
    doRequest,
    HttpMethod
}