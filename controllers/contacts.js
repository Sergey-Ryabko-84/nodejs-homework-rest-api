const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../utils");

const getAll = async (req, res, next) => {
  const contactsList = await contacts.listContacts();
  res.json(contactsList);
};

const getById = async (req, res, next) => {
  const contact = await contacts.getContact(req.params.id);
  if (!contact) throw HttpError(404, "Not found");
  res.json(contact);
};

const add = async (req, res, next) => {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};

const updateById = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "missing fields");
  const contact = await contacts.updateContact(req.params.id, req.body);
  if (!contact) throw HttpError(404, "Not found");
  res.json(contact);
};

const deleteById = async (req, res, next) => {
  const contact = await contacts.removeContact(req.params.id);
  if (!contact) throw HttpError(404, "Not found");
  res.json({ message: "contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
