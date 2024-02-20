import { listContacts, getContactById, addContact, removeContact, updateContactById } from "../services/contactsServices.js";
import asyncTryCatch from "../helpers/asyncTryCatch.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = asyncTryCatch(async (_, res) => {
    const contactList = await listContacts();
    res.status(200).json(contactList);
});

export const getOneContact = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await getContactById(id);

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.status(200).json(targetContact);
});

export const createContact = asyncTryCatch(async (req, res) => {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
});

export const updateContact = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await updateContactById(id, req.body);

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.status(200).json(targetContact);
});

export const deleteContact = asyncTryCatch(async (req, res) => {
    const { id } = req.params;
    const targetContact = await removeContact(id);

    if (!targetContact) {
        throw HttpError(404, "Not Found");
    }

    res.json({
        message: "Delete success"
    })
});

