import express from "express";
import { validateBody, authenticate } from "../middleware/index.js";
import { registerSchema, loginSchema, updateSubscriptionSchema } from "../models/index.js";
import { register, login, getCurrent, logout, updateSubscription } from "../controllers/authContollers.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router()

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

authRouter.patch(
    "/",
    authenticate,
    validateBody(updateSubscriptionSchema),
    updateSubscription
);

authRouter.patch(
    "/",
    authenticate,
    upload.single("avatar"),
    uploadAvatar
);

export default authRouter;
