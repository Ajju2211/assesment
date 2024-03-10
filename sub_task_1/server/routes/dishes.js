import { Router } from "express";
import { AddDish, AllDishes, DeleteDishById, GetDishById, UpdateDish } from "../controller/dish/index.js";
import useValidator from "../middleware/useValidator.js"
import Dish from "../models/Dish.js";

const router = Router();

// post dish
router.post("/",useValidator(Dish.validate),AddDish);
// individual dish
router.patch("/:id",UpdateDish);
router.get("/:id",GetDishById);
router.delete("/:id",DeleteDishById);
// all meals
router.get("/",AllDishes);


export default router;