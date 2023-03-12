const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { User } = require("../models/user");
const { ctrlWrapper, HttpError, imageHandler } = require("../utils");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw HttpError(409, "Email in use");

  const hashPass = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", d: "wavatar" }); // d: "mp"
  const newUser = await User.create({
    ...req.body,
    password: hashPass,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email or password is wrong");
  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) throw HttpError(401, "Email or password is wrong");

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).send();
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
};

const updateSubscription = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "missing field subscription");
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  res.json(user);
};

const updateAvatar = async (req, res) => {
  const { path: tmpUpload, originalname } = req.file;

  await imageHandler(tmpUpload); // Jimp

  const fileName = `${req.user._id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(req.user._id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
