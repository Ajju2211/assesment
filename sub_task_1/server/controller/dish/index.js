import { isValidObjectId } from "mongoose";
import Dish from "../../models/Dish.js";


export const AddDish = async (req, res) => {
    try {
        const dish = new Dish({
            name: req.body.name, ingredients: req.body.ingredients,
            description: req.body.description, dish_type: req.body.dish_type,
            food_for: req.body.food_for, photo: req.body.photo
        })
        await dish.save();
        res.status(200).json({
            ...dish.toJSON()
        })
    } catch (error) {
        console.log("err:", error)
        res.status(500).json({ status: "failed", message: "failed to add dish due to: " + error.message })
        return
    }
};

export const UpdateDish = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id)
        if (dish) {
            res.status(200).json({ ...dish.toJSON() })
            return
        }
        res.status(404).json({ status: "failed", message: "No such dish exists" })
    } catch (error) {
        res.status(500).json({ status: "failed", message: "internal error failed" + error.message })
        return
    }
};

const arr = [
    {
        id: 1,
        name: 'Special milk shake',
        description: 'Delicious meal for the special occasion',
        dish_type: 'Starter',
        food_for: 'Veg',
        ingredients: [
            { name: 'ilachi', quantity: 10.0, units: "gms" },
            { name: 'rice', quantity: 13.0, units: "kgs" },
            { name: 'honey', quantity: 1, units: "spoon" },
            { name: 'milk', quantity: 1, units: "ltr" },
        ],
        photo: ""
    },
    {
        id: 2,
        name: 'Special milk shake',
        description: 'Delicious meal for the special occasion',
        dish_type: 'Starter',
        food_for: 'Veg',
        ingredients: [
            { name: 'ilachi', quantity: 10.0, units: "gms" },
            { name: 'rice', quantity: 13.0, units: "kgs" },
            { name: 'honey', quantity: 1, units: "spoon" },
            { name: 'milk', quantity: 1, units: "ltr" },
        ],
        photo: ""
    },
]

export const AllDishes = async (req, res) => {
    const query = {}
    const sortBy = {}

    // return res.json([...arr.slice(req.query.skip).slice(0, req.query.limit)])
    req.query.name = req?.query?.name?.trim()
    req.query.cuisine_type = req?.query?.cuisine_type?.trim()
    if (req.query.name && req.query.name !== "") {
        query.name = req.query.name
    }
    if (req.query.cuisine_type && req.query.cuisine_type !== "") {
        query.cuisine_type = req.query.cuisine_type
    }
    if (req.query.sortByName) {
        sortBy.name = req.query.sortByName
    }
    if (req.query.sortByPrice) {
        sortBy.price = req.query.sortByPrice
    }
    let mongoQuery = Dish.find(query).sort(sortBy)
    if (req.query.skip) {
        mongoQuery = mongoQuery.skip(req.query.skip)
    }
    if (req.query.limit) {
        mongoQuery = mongoQuery.limit(req.query.limit)
    }
    const dishes = await mongoQuery
    const data = []
    dishes.forEach(meal => {
        data.push(meal.toJSON())
    });
    res.status(200).json({ dishes: data })
};

export const GetDishById = async (req, res) => {
    try {
        const { id } = req.params
        const meal = await Dish.findById(id)
        if (!meal) {
            res.status(400).json({ message: "No such dish found " + id })
            return
        }
        return res.status(200).json(meal.toJSON())
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "failed due to: " + error.message })
        return
    }
    return
};

export const DeleteDishById = async (req, res) => {
    let n = 1000000000
    while (n--) {

    }
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(200).json({ message: "deleted successfully" })
        }
        await Dish.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log("err:", error.message)
    }
    res.status(200).json({ message: "deleted successfully" })
};