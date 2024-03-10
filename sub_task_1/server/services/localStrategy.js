import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import Joi from 'joi';

import User from '../models/User.js';
import { loginSchema } from '../helpers/validators.js';
import strings from '../utils/strings.js';

const passportLogin = new PassportLocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  async (req, username, password, done) => {
    const query = {};
    if(username.includes("@")){
      req.body.email = username.toLowerCase().trim()
      query.email = req.body.email
    } else {
      req.body.phoneNumber = strings.addPrefixToPhoneNumber(username.trim())
      query.phoneNumber = req.body.phoneNumber
    }
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return done(null, false, { message: error.details[0].message });
    }

    try {
      const user = await User.findOne(query);
      if (!user) {
        const maskedUserName = query.email? query.email.slice(0,2)+"XXX"+query.email.slice(a.indexOf('@')):query.phoneNumber.slice(3,5)+"XXXXX"+query.phoneNumber.slice(a.length-3)
        return done(null, false, { message: `Nothing linked with ${maskedUserName}` });
      }
      if(!user.checkPassword(password)){
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

passport.use(passportLogin);
