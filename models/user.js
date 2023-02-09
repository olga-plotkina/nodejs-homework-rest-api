const { Schema, model } = require("mongoose");
const gravatar = require("gravatar");

const usersSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
    },
  },
  { versionKey: false }
);

usersSchema.pre("save", function (next) {
  const url = gravatar.url(this.email);
  this.avatarUrl = url;
  next();
});

const Users = model("user", usersSchema);

module.exports = {
  Users,
};
