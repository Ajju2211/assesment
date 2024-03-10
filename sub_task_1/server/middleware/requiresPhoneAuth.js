import passport from 'passport';

const requirePhoneAuth = (req, res, next) => {
  passport.authenticate('phone-login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(422).send(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default requirePhoneAuth;
