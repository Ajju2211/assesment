import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import flash from "connect-flash";
import { redisClient } from "./configs/redis.js";
import passport from "passport";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  store:redisClient,
  standardHeaders: true,
  legacyHeaders: false,
});

// static files
// app.use(express.static(__dirname + '/public', { dotfiles: 'allow' }));

// rate limiter
if (process.env.NODE_ENV == "production") {
  // set trust proxy from the left most ip
  app.set("trust proxy", 1);
  app.use(limiter);
}

// Routes
import routes from "./routes/index.js";

// enable cors Requests
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse cookies
app.use(cookieParser());
// connection mongodb
import "./configs/mongo.js";
import "./configs/appSetup.js";
// passport authentications
app.use(passport.initialize());
// configuring passport googleStrategy as middleware
import "./services/jwtStrategy.js";
import "./services/googleStrategy.js";
import "./services/localStrategy.js";
import "./services/phoneStategy.js";
app.use(flash());
// app.use((r, rs, nx) => { console.log(r.isAuthenticated()); nx(); })

// Routes
app.use("/", routes);

//Handling unexpected routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
