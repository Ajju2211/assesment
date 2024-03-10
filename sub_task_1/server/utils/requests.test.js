import { strict as assert } from 'assert';
import requests from './requests.js';
import test from "node:test";

test('Requests module', async () => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const postData = { title: 'testing post', body: 'Some testing', userId: 1 };

    const result = await requests.doRequest(apiUrl, requests.HttpMethod.POST, postData);

    assert.strictEqual(result.error, null);
    const id = result.response.id;
    delete result.response.id;
    assert.deepStrictEqual(result.response, postData);

    const notFoundResult = await requests.doRequest(apiUrl + "/somethingDNE", requests.HttpMethod.GET);

    assert.strictEqual(notFoundResult.error,"Not Found");
    assert.strictEqual(notFoundResult.statusCode,404);

    const malformedResult = await requests.doRequest("example.com", requests.HttpMethod.GET);

    assert.strictEqual(malformedResult.error,"ECONNREFUSED");
    assert.strictEqual(malformedResult.statusCode,500);
});
