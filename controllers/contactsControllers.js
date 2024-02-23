import { Contact } from "../models/contact.js";
import asyncTryCatch from "../helpers/asyncTryCatch.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = asyncTryCatch(async (_, res) => {
    const contactList = await Contact.find({}, "name email phone favorite");
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
    const newContact = await Contact.create(req.body);
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
        throw HttpErfror(404, "Not Found");
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

