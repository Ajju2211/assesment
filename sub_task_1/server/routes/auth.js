import {Router} from "express"
import passport from "passport";
import requireLocalAuth from "../middleware/requiresLocalAuth.js";
import { registerSchema } from "../helpers/validators.js";
import { PhoneLogin, RegisterUser } from "../controller/user/index.js";
import requirePhoneAuth from "../middleware/requiresPhoneAuth.js";
import requireJwtAuth from "../middleware/requiresJWTAuth.js";
const router = Router({ mergeParams: true });

router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      callbackURL: "http://localhost:3000/google/cb",
    }),
  );

router.get(
    '/google/cb',
    passport.authenticate('google', {
      failureRedirect: '/',
      session: false,
    }),
    (req, res) => {
      const token = req.user.generateJWT();
      res.cookie('session', token);
    //   clientURL
      res.redirect("http://localhost:3000");
    },
);

router.post('/login', requireLocalAuth, (req, res) => {
  const token = req.user.generateJWT();
  const me = req.user.toJSON();
  res.cookie('session', token);
  res.json({ token, me });
});

router.post('/ph_verify', requirePhoneAuth, (req, res) => {
  const token = req.user.generateJWT();
  const me = req.user.toJSON();
  res.cookie('session', token);
  res.json({ token, me });
});

router.post('/ph_login', PhoneLogin);

router.post('/register', RegisterUser);

router.get("/logout", (req, res,next) => {
    res.clearCookie("session");
    res.send(false);
})

export default router;
