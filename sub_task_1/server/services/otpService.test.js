import sendOtp from "../services/otpService.js"
import test from "node:test"
import assert from "node:assert"

import strings from "../utils/strings.js";

test("sending OTP",async (t)=>{
    const otpResult =  await sendOtp(strings.generateOtp(),"7676059315")
    assert.strictEqual(otpResult,null)

    assert.strictEqual(await sendOtp(strings.generateOtp(),"767605931"),"failed to send otp due to:Bad Request")

    assert.strictEqual(await sendOtp(strings.generateOtp(),""),"failed to send otp due to:Bad Request")

    assert.strictEqual(await sendOtp(strings.generateOtp(),"7997289947"),null)
})