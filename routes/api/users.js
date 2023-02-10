const routers = require("express").Router();

const {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  changeSubscriptionController,
  checkVerifyController,
} = require("../../controllers/users");
const { uploadController } = require("../../controllers/files");

const uploadMiddleware = require("../../middlewares/uploadMidleware");
const { asyncWrapper } = require("../../helpers/apiHelpers");

const { authMiddleware, verifyMiddleware } = require("../../middlewares/auth");

const {
  authUserValidation,
  checkVerifyValidation,
} = require("../../middlewares/validationMiddleware");

routers.post(
  "/signup",
  authUserValidation,
  asyncWrapper(registerUserController)
);

routers.post(
  "/login",
  verifyMiddleware,
  authUserValidation,
  asyncWrapper(loginUserController)
);

routers.post(
  "/verify",
  checkVerifyValidation,
  asyncWrapper(checkVerifyController)
);

routers.get("/logout", authMiddleware, asyncWrapper(logoutUserController));

routers.get("/current", authMiddleware, asyncWrapper(refreshUserController));

routers.patch("/", authMiddleware, asyncWrapper(changeSubscriptionController));

routers.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  uploadController
);

module.exports = routers;
