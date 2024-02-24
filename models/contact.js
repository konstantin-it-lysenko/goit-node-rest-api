import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../middleware/index.js";

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
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleMongooseError)

export const createContactSchema = Joi.object({
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

export const updateContactSchema = Joi.object({
    name: Joi.string().max(30),
    email: Joi.string().email(),
    phone: Joi.string().min(9).max(18),
    favorite: Joi.boolean()
});

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean()
        .required()
        .messages({ "any.required": "Missing required favorite field" })
})

export const Contact = model('contact', contactSchema);
