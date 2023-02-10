const { Users } = require("../models/user");
const { NotFoundError } = require("../helpers/errors");

const verificationUser = async (verificationToken) => {
  const candidate = await Users.findOne({ verificationToken });
  if (!candidate) {
    throw new NotFoundError("Not found");
  }
  return await Users.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true },
    { new: true }
  );
};

module.exports = { verificationUser };
