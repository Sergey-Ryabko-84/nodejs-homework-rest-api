const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

// singup
router.post("/register", validateBody(schemas.authSchema), ctrl.register)

// singin
router.post("/login", validateBody(schemas.authSchema), ctrl.login)
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrent);

// subscription
router.patch(
  "/",
  authenticate,
  validateBody(schemas.subscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;