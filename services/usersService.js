const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { nanoid } = require("nanoid");
const { sendNodemailer } = require("../helpers/sendNodemailer");

const { Users } = require("../models/user");
const {
  NotAuthorizedError,
  ConflictExistingEmailError,
  WrongParametersError,
} = require("../helpers/errors");
const { SECRET_KEY } = process.env;

const registerUser = async ({ email, password }) => {
  const candidate = await Users.findOne({ email });
  if (candidate) {
    throw new ConflictExistingEmailError("Email in use");
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  const verificationToken = nanoid();

  const newUser = await Users.create({
    verificationToken,
    email,
    password: hashPassword,
  });

  await sendNodemailer({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="localhost:8085/users/verify/${verificationToken}">Confirm your email</a>`,
  });
  return newUser;
};

const loginUser = async ({ email, password }) => {
  const candidate = await Users.findOne({ email });
  if (!candidate) {
    throw new NotAuthorizedError("Email or password is wrong");
  }

  const comparePassword = bcrypt.compareSync(password, candidate.password);
  if (!comparePassword) {
    throw new NotAuthorizedError("Email or password is wrong");
  }

  const token = jwt.sign({ _id: candidate._id }, SECRET_KEY);
  const user = await Users.findByIdAndUpdate(
    candidate._id,
    { token },
    { new: true }
  );
  return user;
};

const logoutUser = async (id) => {
  const candidate = await Users.findById(id);
  return candidate;
};

const refreshUser = async (token) => {
  const candidate = await Users.findOne({ token });
  if (!candidate) {
    throw new NotAuthorizedError("Not authorized");
  }
  return {
    email: candidate.email,
    subscription: candidate.subscription,
    avatarUrl: candidate.avatarUrl,
  };
};

const checkVerify = async (email) => {
  const candidate = await Users.findOne({ email });
  if (!candidate) {
    throw new ConflictExistingEmailError("User with this email does not exist");
  }

  if (candidate.verify === true) {
    throw new WrongParametersError("Verification has already been passed");
  }

  await sendNodemailer({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="localhost:8085/users/verify/${candidate.verificationToken}">Confirm your email</a>`,
  });
};

const changeSubscription = async (id, body) => {
  return await Users.findOneAndUpdate(
    { _id: id },
    { subscription: body.subscription },
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  checkVerify,
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  changeSubscription,
};
