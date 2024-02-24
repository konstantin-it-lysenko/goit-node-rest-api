import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateFavorite,
  updateContact,
} from "../controllers/contactsControllers.js";
import { isValidId, validateBody, authenticate } from "../middleware/index.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.patch("/:id/favorite", authenticate, isValidId, validateBody(updateFavoriteSchema), updateFavorite);

contactsRouter.put("/:id", authenticate, isValidId, validateBody(updateContactSchema), updateContact);

export default contactsRouter;
