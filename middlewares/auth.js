const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../helpers/errors");
const { Users } = require("../models/user");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (!token || bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized1" });
  }

  try {
    const { _id } = jwt.verify(token, SECRET_KEY);
    const candidate = await Users.findById(_id);
    if (!candidate) {
      return res.status(401).json({ message: "Not authorized2" });
    }
    req.user = candidate;
    console.log("candidate in middleware", candidate);
    next();
  } catch (error) {
    next(new NotAuthorizedError(error.message));
  }
};

module.exports = auth;
