import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/User.js';

const customExtractor = (req)=>{
  let token = null;
  token = ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req);
  if(token!=null) {
    return token;
  }
    if (req && req.cookies) {
        token = req.cookies['session'];
    }
    return token;
}
// JWT strategy
const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: customExtractor,
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  },
);

passport.use(jwtLogin);

export default jwtLogin;