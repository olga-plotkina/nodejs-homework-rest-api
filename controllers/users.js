const {
  registerUser,
  loginUser,
  logoutUser,
  refreshUser,
  changeSubscription,
  checkVerify,
} = require("../services/usersService");

const { MissingFieldsError, NotAuthorizedError } = require("../helpers/errors");

const registerUserController = async (req, res) => {
  const newUser = await registerUser(req.body);
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const loginUserController = async (req, res) => {
  const userAccount = await loginUser(req.body);
  res.status(201).json({
    user: { email: userAccount.email, subscription: userAccount.subscription },
    token: userAccount.token,
  });
};

const logoutUserController = async (req, res) => {
  const ifUserExists = await logoutUser(req.user._id);
  if (!ifUserExists) {
    throw new NotAuthorizedError("Not authorized");
  }
  req.user.token = null;

  res.status(204).json();
};

const refreshUserController = async (req, res) => {
  const user = await refreshUser(req.user.token);
  res.json(user);
};

const checkVerifyController = async (req, res) => {
  const { email } = req.body;
  await checkVerify(email);
  res.json({ message: "Verification email sent" });
};

const changeSubscriptionController = async (req, res) => {
  if (!req.body.subscription) {
    throw new MissingFieldsError("Missing field subscription");
  }
  const user = await changeSubscription(req.user._id, req.body);
  res.json(user);
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  changeSubscriptionController,
  checkVerifyController,
};
