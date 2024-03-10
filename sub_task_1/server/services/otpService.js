import strings from "../utils/strings.js";
import requests from "../utils/requests.js";
import nodemailer from 'nodemailer';
import mailjetTransport from 'nodemailer-mailjet-transport';
import templates from "../templates/index.js";

const API_ENDPOINT = "https://sms.capcom.me/api/3rdparty/v1";

/**
 * Sends a 6 digit otp to the phoneNumber
 *
 * @async
 * @param {String} otp
 * @param {String} phoneNumber
 * @returns {Promise<String|null>} - A Promise resolving to sendOtp.
 */
const sendOtp = async (otp, phoneNumber) => {
    phoneNumber = strings.addPrefixToPhoneNumber(phoneNumber);
    const basicAuth = strings.getBasicAuthorization(
        process.env.OTP_SENDER_USERNAME,
        process.env.OTP_SENDER_PASSWORD
    );

    const result = await requests.doRequest(
        API_ENDPOINT + "/message",
        requests.HttpMethod.POST,
        {
            message: `Hey there, from Opstech.\n Your OTP to login: ${otp}`,
            phoneNumbers: [phoneNumber],
        },
        { Authorization: basicAuth }
    );
    if (result.error != null) {
        return "failed to send otp due to:" + result.error;
    }
    if (result.statusCode < 200) {
        return "failed to send otp";
    }
    return null;
};


const sendEmail = async (email,subject, html) => {
    const transport = nodemailer.createTransport(mailjetTransport({
        auth: {
          apiKey: 'key',
          apiSecret: 'secret'
        }
      }));
      const mail = {
        from: 'azharuddinmd2211@gmail.com',
        to: email,
        subject: subject,
        html: html
      };
      
      try {
        const info = await transport.sendMail(mail);
        return {
            result: info,
            error:null
        };
      } catch (err) {
        return {
            error: err,
            result: null
        }
      }
}

// templates.emailVerification({
//     otp: "1234",
//     link:"#"
// })

const sendEmailVerification = async (email) => {
    // const otp = generate
    // return sendEmail()
}

export default sendOtp;
