import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// CommonJS: -> path.join(__dirname, 'contacts.json')
const contactsPath = path.resolve("db", "contacts.json");

export const listContacts = async () => {
    const contactListBuffer = await fs.readFile(contactsPath);
    return JSON.parse(contactListBuffer.toString());
}

export const getContactById = async (contactId) => {
    const contactList = await listContacts();
    const targetContact = contactList.find(({ id }) => id === contactId);

    return targetContact || null;
}

export const addContact = async ({ name, email, phone }) => {
    const contactList = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contactList.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));

    return newContact;
}

export const updateContactById = async (contactId, data) => {
    const contactList = await listContacts();
    const contactIndex = contactList.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
        return null;
    }

    const targetContact = contactList.find(({ id }) => id === contactId);
    contactList[contactIndex] = { id, ...targetContact, ...data };

    await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));

    return contactList[contactIndex];
}

export const removeContact = async (contactId) => {
    const contactList = await listContacts();
    const contactIndex = contactList.findIndex(({ id }) => id === contactId);
    if (contactIndex === -1) {
        return null;
    }

    const [removedContact] = contactList.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));

    return removedContact;
}
