import assert from "node:assert";
import test from "node:test";
import dates from "./dates.js";

test("time expiration", (t) => {
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 1000);
    const expirationSeconds = 5;
    assert.strictEqual(
        dates.hasExpired(futureTime, expirationSeconds),
        false,
        "Test Case 1 failed"
    );

    const pastTime = new Date(currentTime.getTime() - 10000);
    assert.strictEqual(
        dates.hasExpired(pastTime, expirationSeconds),
        true,
        "Test Case 2 failed"
    );

    const expirationTime = new Date(currentTime.getTime() + 5000);
    assert.strictEqual(
        dates.hasExpired(expirationTime, expirationSeconds),
        false,
        "Test Case 3 failed"
    );

    const smallExpirationTime = new Date(currentTime.getTime() - 1000);
    const smallExpirationSeconds = 1;
    assert.strictEqual(
        dates.hasExpired(smallExpirationTime, smallExpirationSeconds),
        true,
        "Test Case 4 failed"
    );
});
