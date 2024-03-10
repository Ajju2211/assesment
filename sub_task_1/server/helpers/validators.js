import Joi from 'joi';

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().optional(),
  phoneNumber: Joi.string().trim().pattern(/^(?:\+91|91)?[0-9]{10}$/).optional(),
  password: Joi.string().trim().min(6).max(20).required(),
});

export const registerSchema = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }),
    fullName: Joi.string().min(2).max(30).required(),
    password: Joi.string().trim().min(6).max(20).required(),
});

export const loginWithPhoneSchema = Joi.object().keys({
  phoneNumber: Joi.string().trim().pattern(/^(?:\+91|91)?[0-9]{10}$/).required(),
  otp: Joi.string().trim().min(6).max(20).required(),
});

export const phoneLoginOtpRequestSchema = Joi.object().keys({
  phoneNumber: Joi.string().trim().pattern(/^(?:\+91|91)?[0-9]{10}$/).required()
});