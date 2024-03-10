import { Router } from "express";
import { EditProfile, Profile } from "../controller/user/index.js";

const router = Router();

router.get("/",Profile);
router.patch("/",EditProfile);

export default router;