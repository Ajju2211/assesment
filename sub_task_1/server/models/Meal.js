
import mongoose from 'mongoose';
import Joi from 'joi';
import uniqueValidator from "mongoose-unique-validator"
import constants from '../utils/constants.json' assert {type: 'json'};

const { Schema } = mongoose;
const mealSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            lowercase: true
        },
        cuisine_type: { type: String, index: true },
        price: mongoose.Types.Decimal128,
        dishes: [{
            type: Schema.Types.ObjectId,
            ref: 'Dish'
        }],
        timeToCookMins: Number,
        food_for: String,
        photo: String
    },
    { timestamps: true },
);


mealSchema.plugin(uniqueValidator)

mealSchema.methods.toJSON = function () {
    const doc = this.toObject();
    if (doc.dishes && doc.dishes.length > 0) {
        if (!(doc.dishes[0] instanceof mongoose.Types.ObjectId)) {
            doc.dishes = doc.dishes.map(dish => {
                return {
                    id: dish._id,
                    ...dish, _id: undefined, __v: undefined
                }
            });
        }
    }
    doc.id = doc._id;
    delete doc._id;
    delete doc.__v;
    doc.price = parseFloat(doc.price.toString())
    return doc;
};

const FOOD_FOR_ALLOWED = [constants.FOOD_FOR.VEG, constants.FOOD_FOR.NON_VEG, constants.FOOD_FOR.EGG]

mealSchema.statics.validate = (meal) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().greater(0).required(),
        cuisine_type: Joi.string().required(),
        dishes: Joi.array().min(1, "requires atleast one dish to be selected").required(),
        timeToCookMins: Joi.number().required(),
        food_for: Joi.string().allow(...FOOD_FOR_ALLOWED).required(),
        photo: Joi.string().required()
    });
    return schema.validate(meal);
};

const Meal = mongoose.model('Meal', mealSchema);

export default Meal