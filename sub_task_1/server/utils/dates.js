/**
 * Checks time has expired or not.
 * @param {Date} givenTime - time to check.
 * @param {number} [expirationSeconds = 300] - Expiration window in mins (default is 5 minutes).
 * @returns {boolean}.
 */
function hasExpired(givenTime, expirationSeconds = 30) {
    const expirationTime = givenTime.getTime() + (expirationSeconds * 1000); 
    const currentTime = new Date().getTime();

    return currentTime >= expirationTime;
}


/**
 * @param {Date} givenTime
 * @param {number} [expirationSeconds=5]
 * @returns {number}
 */
function secondsRemaining(givenTime, expirationSeconds = 5) {
    const expirationTime = givenTime.getTime() + (expirationSeconds * 1000);
    const currentTime = new Date().getTime();
    const secondsRemaining = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
    return secondsRemaining;
}

export default {
    hasExpired,
    secondsRemaining
}