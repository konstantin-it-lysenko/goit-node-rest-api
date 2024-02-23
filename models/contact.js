import { Schema, model } from "mongoose";
import Joi from "joi";
import { middlewares } from "../middleware/index.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    favorite: {
        type: Boolean,
        default: false
    }
}, { versionKey: false, timestamps: true });

contactSchema.post("save", middlewares.handleMongooseError)

const createContactSchema = Joi.object({
    name: Joi.string()
        .max(30)
        .required()
        .messages({ "any.required": "Missing required name field" }),
    email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": "Missing required email field" }),
    phone: Joi.string().min(9)
        .max(18)
        .required()
        .messages({ "any.required": "Missing required phone field" }),
    favorite: Joi.boolean()
})

const updateContactSchema = Joi.object({
    name: Joi.string().max(30),
    email: Joi.string().email(),
    phone: Joi.string().min(9).max(18)
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean()
        .required()
        .messages({ "any.required": "Missing required favorite field" })
})

export const Contact = model('contact', contactSchema);
export const schemas = {
    createContactSchema,
    updateContactSchema,
    updateFavoriteSchema
}
