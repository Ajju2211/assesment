import strings from './strings.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { validate as uuidValidate } from 'uuid';

test('Phone number addPrefix', (t) => {
   assert.strictEqual(strings.addPrefixToPhoneNumber("9990001111"), "+919990001111")
   assert.strictEqual(strings.addPrefixToPhoneNumber("919990001111"), "+919990001111")
   assert.strictEqual(strings.addPrefixToPhoneNumber("09990001111"), "+919990001111")
})

test('Capitalizing', (t) => {
   assert.strictEqual(strings.capitalizeFirstLetter("opstech"), "Opstech")
   assert.strictEqual(strings.capitalizeSentence("opstech builds cool tech"), "Opstech Builds Cool Tech")
})

test('OTP', (t) => {
   const otp = strings.generateOtp();
   assert.strictEqual(typeof otp, "string", "OTP should be string");

   assert.strictEqual(otp.length, 6, "OTP length should be 6");

   const isDigitsOnly = /^[0-9]+$/.test(otp);
   assert.strictEqual(isDigitsOnly, true, "OTP should only contain digits");

   const otp2 = strings.generateOtp();
   assert.notStrictEqual(otp, otp2, "Multiple calls should generate different OTPs");
})

test('Basic Authorization token encoding', () => {
   assert.strictEqual(strings.getBasicAuthorization("test_user","something123"),"Basic dGVzdF91c2VyOnNvbWV0aGluZzEyMw==");
})

test('md5 hash encryption', () => {
   assert.strictEqual(strings.md5Encrypt("zindagi ek safar hi suhana","rajesh khanna"),"4a06201bf717eaab537572dd34ad9984");

   assert.notStrictEqual(strings.md5Encrypt("zindagi ek safar hi suhana","rajesh"),"4a06201bf717eaab537572dd34ad9984");

   assert.strictEqual(strings.isSameMd5Hash("4a06201bf717eaab537572dd34ad9984","zindagi ek safar hi suhana","rajesh khanna"),true);
})

test('uuid', () => {
   assert.strictEqual(uuidValidate(strings.getUUID()),true)
})