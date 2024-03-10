import { Router } from 'express';
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import mealRoutes from "./meals.js";
import dishRoutes from "./dishes.js";
import constants from "../utils/constants.json" assert {type: "json"};
import passport from 'passport';
import requireJwtAuth from '../middleware/requiresJWTAuth.js';

const router = Router();

// health ping
router.get("/", (req, res) => res.status(200).send("Ok"));
router.use(authRoutes);
// protect the routes
router.use(requireJwtAuth);
router.get("/tkn", (req, res) => res.status(200).json({ message: "ok" }))
router.use("/me", userRoutes);
router.use("/meals", mealRoutes);
router.use("/dishes", dishRoutes);


export default router
