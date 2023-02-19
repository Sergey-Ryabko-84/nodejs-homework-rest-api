const express = require("express");
const Joi = require("joi");
const contacts = require("../../models/contacts");
const { HttpError } = require("../../utils");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();
    res.json(contactsList);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const contact = await contacts.getContact(req.params.id);
    if (!contact) throw HttpError(404, "Not found");
    res.json(contact);
  }
  catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  }
  catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const contact = await contacts.removeContact(req.params.id);
    if (!contact) throw HttpError(404, "Not found");
    res.json({ message: "contact deleted" });
  }
  catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0)
      throw HttpError(400, "missing fields");
    const { error } = putSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const contact = await contacts.updateContact(req.params.id, req.body);
    if (!contact) throw HttpError(404, "Not found");
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
