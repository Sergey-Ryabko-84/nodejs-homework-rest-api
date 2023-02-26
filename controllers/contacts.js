const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../utils");

const getAll = async (req, res, next) => {
  const contactsList = await Contact.find();
  res.json(contactsList);
};

const getById = async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw HttpError(404, "Not found");
  res.json(contact);
};

const add = async (req, res, next) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const updateById = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "missing fields");
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!contact) throw HttpError(404, "Not found");
  res.json(contact);
};

const updateStatusContact = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "missing field favorite");
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!contact) throw HttpError(404, "Not found");
  res.json(contact);
};

const deleteById = async (req, res, next) => {
  const contact = await Contact.findByIdAndRemove(req.params.id);
  if (!contact) throw HttpError(404, "Not found");
  res.json({ message: "contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteById: ctrlWrapper(deleteById),
};
