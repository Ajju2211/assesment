import mongoose from 'mongoose';
import Joi from 'joi';
import uniqueValidator from "mongoose-unique-validator";
import constants from '../utils/constants.json' assert {type: 'json'};

const { Schema } = mongoose;
const ingredientSchema = new Schema({
    name: String,
    quantity: Number,
    units: String
})
const dishSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            lowercase: true
        },
        ingredients: {
            type: [ingredientSchema],
        },
        description: String,
        dish_type: String,
        food_for: String,
        photo: String
    },
    { timestamps: true },
);

dishSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

dishSchema.plugin(uniqueValidator)

const defaultCuisines = [constants.DISH_TYPE.STARTER, constants.DISH_TYPE.MAIN_COURSE, constants.DISH_TYPE.DESSERT]

const defaultFoodFor = [constants.FOOD_FOR.VEG, constants.FOOD_FOR.NON_VEG, constants.FOOD_FOR.EGG]

dishSchema.statics.validate = (dish) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        ingredients: Joi.array().items({ name: Joi.string(), quantity: Joi.number(), units: Joi.string() }).min(1).required(),
        description: Joi.string().optional(),
        dish_type: Joi.string().allow(...defaultCuisines).required(),
        food_for: Joi.string().allow(...defaultFoodFor).required(),
        photo: Joi.string().uri().required()
    });
    return schema.validate(dish);
};

const Dish = mongoose.model('Dish', dishSchema);

export default Dish