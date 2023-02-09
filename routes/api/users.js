const routers = require("express").Router();

const {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  changeSubscriptionController,
} = require("../../controllers/users");
const { uploadController } = require("../../controllers/files");

const uploadMiddleware = require("../../middlewares/uploadMidleware");
const { asyncWrapper } = require("../../helpers/apiHelpers");

const auth = require("../../middlewares/auth");
const {
  authUserValidation,
} = require("../../middlewares/validationMiddleware");

routers.post(
  "/signup",
  authUserValidation,
  asyncWrapper(registerUserController)
);

routers.post("/login", authUserValidation, asyncWrapper(loginUserController));

routers.get("/logout", auth, asyncWrapper(logoutUserController));

routers.get("/current", auth, asyncWrapper(refreshUserController));

routers.patch("/", auth, asyncWrapper(changeSubscriptionController));

routers.patch(
  "/avatars",
  auth,
  uploadMiddleware.single("avatar"),
  uploadController
);

module.exports = routers;
