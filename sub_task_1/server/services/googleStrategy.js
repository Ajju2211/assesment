import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../models/User.js';

const serverUrl = process.env.SERVER_URL;

export const googleLogin = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
    scope: ["email", "profile"],
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const oldUser = await User.findOne({ email: profile.email });

      if (oldUser) {
        return done(null, oldUser);
      }
    } catch (err) {
      console.error("Err::",err);
    }

    try {
      const newUser = await new User({
        googleId: profile.id,
        email: profile.email,
        fullName: profile.displayName,
        avatar: profile.picture,
        isEmailVerified:true
      }).save();
      done(null, newUser);
    } catch (err) {
      console.error("Err::",err);
    }
  },
);

passport.use(googleLogin);

export default googleLogin;