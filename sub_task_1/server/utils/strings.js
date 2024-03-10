import crypto from 'node:crypto'
import { v4 as uuidv4 } from 'uuid'

const otpSize = 6
const digits = '0123456789';

const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Will capitalize the each word first letter in a sentence
 *
 * @param {String} sentence
 * @returns {String}
 */
const capitalizeSentence = 
(sentence) =>
    sentence.split(" ").map(capitalizeFirstLetter).join(" ");


/**
 * Will get the avatar based on the name randomness
 *
 * @param {String} fullName
 * @returns {String}
 */
const getAvatar = (fullName) =>
    `https://source.boringavatars.com/beam/80/${encodeURIComponent(
        fullName
    )}?colors=595643,4E6B66,ED834E,EBCC6E,EBE1C5`;

/**
 * Will add the +91 prefix to the phoneNumber
 *
 * @param {String} phoneNumber
 * @returns {String}
 */
const addPrefixToPhoneNumber = (phoneNumber) => {
    if (phoneNumber[0] === "+" || phoneNumber[0] === "0") {
        phoneNumber = phoneNumber.slice(1);
    }
    phoneNumber = (phoneNumber.startsWith("91") ? "+" : "+91") + phoneNumber;
    return phoneNumber;
}

const isEmpty = (value) => {
    return (
        value == null || (typeof value === "string" && value.trim().length === 0)
    );
};


/**
 * generates 6 digit otp string
 *
 * @returns {String}
 */
const generateOtp = () => {
    let OTP = '';
    for (let i = 0; i < otpSize; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

/**
 * Returns the Basic Authorization from the username,password
 *
 * @param {String} username
 * @param {String} password
 * @returns {String}
 */
const getBasicAuthorization = (username, password) => {
    return "Basic "+Buffer.from(`${username}:${password}`).toString('base64');
}


/**
 * Encrypt into md5 hash with salt if passed
 *
 * @param {String} str
 * @param {string} [salt=""]
 * @returns {String}
 */
const md5Encrypt = (str, salt="") =>{
  const hash = crypto.createHash('md5');
  const saltedCipher = str + salt;
  hash.update(saltedCipher);
  const hashedString = hash.digest('hex');
  return hashedString;
}


/**
 * Matching hash with given string and salt
 *
 * @param {String} hash
 * @param {String} str
 * @param {String} [salt=""]
 * @returns {boolean}
 */
const isSameMd5Hash = (hash, str, salt="") => {
    return hash === md5Encrypt(str,salt);
}


/**
 * generates uuid
 *
 * @returns {String}
 */
const getUUID = () => {
    return uuidv4()
}



export default {
    capitalizeFirstLetter,
    capitalizeSentence,
    getAvatar,
    addPrefixToPhoneNumber,
    isEmpty,
    generateOtp,
    getBasicAuthorization,
    md5Encrypt,
    isSameMd5Hash,
    getUUID
};
