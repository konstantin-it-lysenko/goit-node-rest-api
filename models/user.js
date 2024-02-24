import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../middleware/index.js";

// const emailRegexp = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";

const userSchema = new Schema({
    password: {
        type: String,
        minlength: 6,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        // match: emailRegexp,
        unique: true,
        required: [true, "Email is required"]
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
    },
    token: {
        type: String,
        default: ""
    }
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

export const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Email must be a valid address",
            "any.required": "Missing required email field",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "any.required": "Missing required password field",
            "string.min": "Password must be at least 6 letters long"
        }),
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .messages({
            "any.only": "Subscription has only 3 values: starter, pro, business",
        })
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Enter is required",
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
    }),
    subscription: Joi.string().valid("starter", "pro", "business").messages({
        "any.only": "Subscription has only 3 values: starter, pro, business",
    })
})

export const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .required()
        .messages({
            "any.required": "Subscription is required",
            "any.only": "Subscription has only 3 values: starter, pro, business",
        }),
});

export const User = model("user", userSchema);
