import { doRequest } from "../../utils/requests"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
export async function loginWithLocal(username, password) {
  const loginResult = await doRequest(API_BASE_URL+"/login","POST",{
    username,password
  })
  if(loginResult.error!=null){
    throw new Error(loginResult.error);
  }
  if(loginResult.statusCode<200){
    console.log("failed to login with local:", loginResult);
    throw new Error("Failed to login with local");
  }
}

export async function phoneLogin(phoneNumber) {
  const phoneOtpResult = await doRequest(API_BASE_URL+"/ph_login","POST",{
    phoneNumber
  })
  if(phoneOtpResult.error!=null){
    throw new Error(phoneOtpResult.error);
  }
  if(phoneOtpResult.statusCode<200){
    console.log("failed to get phone otp:", phoneOtpResult);
    throw new Error("Failed to get phone otp");
  }
  return {data: phoneOtpResult.response}
}

export async function phoneVerify(phoneNumber,otp) {
  const phoneOtpResult = await doRequest(API_BASE_URL+"/ph_verify","POST",{
    phoneNumber,otp
  })
  if(phoneOtpResult.error!=null){
    throw new Error(phoneOtpResult.error);
  }
  if(phoneOtpResult.statusCode<200){
    console.log("failed to verify phone otp:", phoneOtpResult);
    throw new Error("Failed to verify phone otp");
  }
  return {data: phoneOtpResult.response}
}

