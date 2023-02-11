const routers = require("express").Router();

const { asyncWrapper } = require("../../helpers/apiHelpers");
const { verificationController } = require("../../controllers/verification");

routers.get("/:verificationToken", asyncWrapper(verificationController));

module.exports = routers;
