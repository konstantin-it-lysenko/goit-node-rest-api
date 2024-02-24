import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../models/user.js';
import { asyncTryCatch, HttpError } from '../helpers/index.js';
import dotenv from "dotenv";

dotenv.config();

const { SECRET_KEY } = process.env;

export const register = asyncTryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email is already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        },
    })
})

export const login = asyncTryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    })
})

export const getCurrent = asyncTryCatch(async (req, res) => {
    const { email, name } = req.user;

    res.json({
        email,
        subscription
    })
})

export const logout = asyncTryCatch(async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "Logout success"
    })
})

export const updateSubscription = asyncTryCatch(async (req, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(_id, { subscription });

    res.json({
        message: "Subscription has been updated successfully",
    });
});
