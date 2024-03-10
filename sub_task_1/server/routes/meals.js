import { Router } from "express";
import { EditProfile, Profile } from "../controller/user/index.js";
import { AddMeal, AllMeals, DeleteMealById, GetMealById, UpdateMeal } from "../controller/meals/index.js";
import useValidator from "../middleware/useValidator.js"
import Meal from "../models/Meal.js";

const router = Router();

// post meal
router.post("/",useValidator(Meal.validate),AddMeal);
// individual meal
router.patch("/:id",UpdateMeal);
router.get("/:id",GetMealById);
router.delete("/:id",DeleteMealById);
// all meals
router.get("/",AllMeals);


export default router;