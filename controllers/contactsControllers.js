import { Contact } from "../models/index.js";
import { asyncTryCatch, HttpError } from '../helpers/index.js';

export const getAllContacts = asyncTryCatch(async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const contactList = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");
    res.status(200).json(contactList);
});

export const getOneContact = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await Contact.findById(id);

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.status(200).json(targetContact);
});

export const createContact = asyncTryCatch(async (req, res) => {
    const { _id: owner } = req.user;

    const newContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(newContact);
});

export const updateContact = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.status(200).json(targetContact);
});

export const updateFavorite = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.status(200).json(targetContact);
});

export const deleteContact = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await Contact.findByIdAndDelete(id);

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.json({
        message: "Delete success"
    })
});
