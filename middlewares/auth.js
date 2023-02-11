const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../helpers/errors");
const { Users } = require("../models/user");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const authMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (!token || bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const { _id } = jwt.verify(token, SECRET_KEY);
    const candidate = await Users.findById(_id);
    if (!candidate) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = candidate;
    next();
  } catch (error) {
    next(new NotAuthorizedError(error.message));
  }
};

const verifyMiddleware = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Missing field email" });
  }

  try {
    const candidate = await Users.findOne({ email });
    if (candidate.verify === false) {
      return res.status(401).json({ message: "Not verified" });
    }
    next();
  } catch (error) {
    next(new NotAuthorizedError(error.message));
  }
};

module.exports = { verifyMiddleware, authMiddleware };
