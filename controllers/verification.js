const { verificationUser } = require("../services/verificationService");

const verificationController = async (req, res) => {
  await verificationUser(req.params.verificationToken);
  res.json({
    message: "Verification successful",
  });
};

module.exports = { verificationController };
