const express = require("express");
const ctrl = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares")
const schema = require("../../schemas/contacts")

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:id", ctrl.getById);

router.post("/", validateBody(schema.addSchema), ctrl.add);

router.put("/:id", validateBody(schema.putSchema), ctrl.updateById);

router.delete("/:id", ctrl.deleteById);

module.exports = router;
