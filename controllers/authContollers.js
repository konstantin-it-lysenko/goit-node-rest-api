import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";
// import { nanoid } from "nanoid";
import { User } from '../models/user.js';
import { asyncTryCatch, HttpError } from '../helpers/index.js';

dotenv.config();

const { SECRET_KEY } = process.env;
const avatarsDir = path.resolve("public", "avatars");

export const register = asyncTryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email is already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
    console.log(newUser);
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription
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
    const { email, subscription } = req.user;

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
    })
})

export const updateAvatar = asyncTryCatch(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        throw HttpError(401);
    }

    const { path: tempUpload, originalname } = req.file;

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.resolve(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    image.resize(250, 250).write(tempUpload);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.resolve("avatars", filename);
    console.log(avatarURL);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
})
