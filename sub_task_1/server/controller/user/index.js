import User from "../../models/User.js";
import Verification from "../../models/Verification.js";
import strings from "../../utils/strings.js";
import dates from "../../utils/dates.js";
import constants from "../../utils/constants.json" assert { type: "json" };
import sendOtp from "../../services/otpService.js";
import { phoneLoginOtpRequestSchema } from "../../helpers/validators.js";

export const Profile = (req, res) => {
    return res.status(200).json({ ...req.user.toJSON() });
};

export const EditProfile = async (req, res) => {
    if (!strings.isEmpty(req.body.email)) {
        return res.status(400).json({ message: "email can't be changed" });
    }
    const updatedUser = {
        fullName: req.body.fullName,
        password: req.body.password,
    };
    Object.keys(updatedUser).forEach(
        (k) =>
            !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]
    );
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updatedUser },
            { new: true }
        );
        res.status(200).json({ ...user.toJSON() });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Failed to save due to " + error.message,
        });
        return;
    }
};

export const RegisterUser = async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(422).send({ message: error.details[0].message });
    }

    const { email, password, fullName } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(422).send({ message: "Email is in use" });
        }

        try {
            const newUser = await new User({
                email,
                password,
                fullName,
            }).save();
            req.user = newUser;
            const token = req.user.generateJWT();
            res.json({ message: "Register success.", token });
        } catch (err) {
            return next(err);
        }
    } catch (err) {
        return next(err);
    }
};

export const PhoneLogin = async (req, res) => {
    try {
        req.body.phoneNumber = strings.addPrefixToPhoneNumber(req.body.phoneNumber);
        const { error } = phoneLoginOtpRequestSchema.validate(req.body);

        if (error && error.details.length > 0) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingVerification = await Verification.findOne({
            tokenSignedFor: req.body.phoneNumber,
            purpose: constants.VERIFICATION_PURPOSES.AUTHENTICATION,
        });

        if (existingVerification) {
            // If within 30 seconds for a retry
            if (!dates.hasExpired(existingVerification.updatedAt, 30)) {
                const remainingSeconds = dates.secondsRemaining(
                    existingVerification.updatedAt,
                    30
                );
                return res
                    .status(400)
                    .json({ message: `Please try after ${remainingSeconds} secs` });
            }

            // TODO: Implement multiple retries lock with redis

            existingVerification.otp = strings.generateOtp();
            const sendOtpErr = await sendOtp(
                existingVerification.otp,
                req.body.phoneNumber
            );

            if (sendOtpErr !== null) {
                return res.status(500).json({ message: sendOtpErr });
            }

            // When <30 sec for the window to expire
            if (
                existingVerification.createdAt.getTime() +
                300 * 1000 -
                existingVerification.updatedAt.getTime() <
                30
            ) {
                existingVerification.expiresAt = new Date();
                existingVerification.createdAt = new Date();
            }

            await existingVerification.save();
            return res.status(200).json({ message: "OTP sent successfully" });
        }

        const verification = new Verification({
            tokenSignedFor: req.body.phoneNumber,
            otp: strings.generateOtp(),
            purpose: constants.VERIFICATION_PURPOSES.AUTHENTICATION,
        });

        verification.otp = strings.generateOtp();
        const sendOtpErr = await sendOtp(verification.otp, req.body.phoneNumber);

        if (sendOtpErr !== null) {
            return res.status(500).json({ message: sendOtpErr });
        }

        await verification.save();
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in PhoneLogin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};