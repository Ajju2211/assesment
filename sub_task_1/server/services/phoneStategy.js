import passport from 'passport';
import { Strategy as PassportPhoneStrategy } from 'passport-custom';

import User from '../models/User.js';
import { loginWithPhoneSchema } from '../helpers/validators.js';
import strings from '../utils/strings.js';
import dates from '../utils/dates.js';
import Verification from '../models/Verification.js';
import constants from '../utils/constants.json' assert {type: "json"};


const passportPhoneLogin = new PassportPhoneStrategy(
    async (req, done) => {
        const { error } = loginWithPhoneSchema.validate(req.body);
        if (error) {
            return done(null, false, { message: error.details[0].message });
        }
        req.body.phoneNumber = strings.addPrefixToPhoneNumber(req.body.phoneNumber)

        try {
            const verification = await Verification.findOne({ tokenSignedFor: req.body.phoneNumber, purpose: constants.VERIFICATION_PURPOSES.AUTHENTICATION });
            if (!verification) {
                const maskedNumber = req.body.phoneNumber.slice(3, 5) + "XXXXX" + req.body.phoneNumber.slice(req.body.phoneNumber.length - 3)
                return done(null, false, { message: `Expired otp for ${maskedNumber}` });
            }

            if (dates.hasExpired(verification.createdAt, 300)) {
                await Verification.deleteOne({ _id: verification._id });
                return done(null, false, { message: 'OTP has expired' });
            }
            if (verification.otp != req.body.otp) {
                //TODO: update the trials here
                return done(null, false, { message: 'Incorrect OTP' });
            }
            const oldUser = await User.findOne({ phoneNumber: req.body.phoneNumber });

            if (oldUser) {
                if (!oldUser.isPhoneVerified) {
                    oldUser.isPhoneVerified = true;
                    await oldUser.save();
                }
                await Verification.deleteOne({ _id: verification._id });
                return done(null, oldUser);
            }

            const newUser = await new User({
                phoneNumber: req.body.phoneNumber,
                isPhoneVerified: true
            }).save();
            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    },
);

passport.use("phone-login", passportPhoneLogin);
