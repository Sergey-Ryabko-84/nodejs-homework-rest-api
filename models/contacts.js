const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require("nanoid");

const contactsPath = path.resolve('./models/contacts.json');

const listContacts = async () => JSON.parse(await fs.readFile(contactsPath));

const getContact = async (contactId) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const contact = contacts.find(({ id }) => id === contactId);
  return contact || null;
}

const removeContact = async (contactId) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const contact = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contact;
}

const addContact = async (body) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const newContact = { id: nanoid(), ...body };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
}
