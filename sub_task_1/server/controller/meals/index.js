import { isValidObjectId } from "mongoose";
import Meal from "../../models/Meal.js";


export const AddMeal = async (req, res) => {
    try {
        const meal = new Meal({
            name: req.body.name,
            dishes: req.body.dishes, cuisine_type: req.body.cuisine_type,
            price: req.body.price, timeToCookMins: req.body.timeToCookMins,
            food_for: req.body.food_for, photo: req.body.photo
        })
        await meal.save();
        res.status(200).json({
            ...meal.toJSON()
        })
    } catch (error) {
        console.log("err:", error)
        res.status(500).json({ status: "failed", message: "failed to add meal due to: " + error.message })
        return
    }
};

export const UpdateMeal = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id)
        if (meal) {
            res.status(200).json({ ...meal.toJSON() })
            return
        }
        res.status(404).json({ status: "failed", message: "No such meal exists" })
    } catch (error) {
        res.status(500).json({ status: "failed", message: "internal error failed" + error.message })
        return
    }
};

const arr = [
    {
        id: 1,
        name: 'Meal 1',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    },
    {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    },
    {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    }, {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    }, {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    }, {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    }, {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    }, {
        id: 2,
        name: 'Meal 2',
        price: '$30.00',
        numberOfDishes: 3,
        cuisine: 'Italian',
        food_for: 'Veg',
        dishes: [
            { id: 1, name: 'Dish 1', price: '$5.00' },
            { id: 2, name: 'Dish 2', price: '$8.00' },
            { id: 3, name: 'Dish 3', price: '$12.00' },
        ]
    }
]

export const AllMeals = async (req, res) => {
    const query = {}
    const sortBy = {}
    // return res.json([...arr.slice(req.query.skip).slice(0,req.query.limit)])
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
    let mongoQuery = Meal.find(query).sort(sortBy)
    if(req.query.skip){
        mongoQuery = mongoQuery.skip(req.query.skip)
    }
    if(req.query.limit){
        mongoQuery = mongoQuery.limit(req.query.limit)
    }
    const meals = await mongoQuery
    const data = []
    meals.forEach(meal => {
        data.push(meal.toJSON())
    });
    res.status(200).json({ meals: data })
};

export const GetMealById = async (req, res) => {
    try {
        const {id} = req.params
        const meal =await Meal.findById(id).populate({path:"dishes",options: { virtuals: true }})
        if(!meal){
            res.status(400).json({message:"No such meal found "+id})
            return
        }
        return res.status(200).json(meal.toJSON())
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"failed due to: "+error.message})
        return
    }
    return
};

export const DeleteMealById = async (req, res) => {
    try {
        if(!isValidObjectId(req.params.id)){
            console.log("invalid", req.params.id)
            return res.status(200).json({message:"deleted successfully"})
        }
        await Meal.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log("err:",error.message)
    }
    res.status(200).json({message:"deleted successfully"})
};