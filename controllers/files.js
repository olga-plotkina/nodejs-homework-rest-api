const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { Users } = require("../models/user");

const uploadController = async (req, res) => {
  const { filename } = req.file;

  const tmpPath = path.resolve("./tmp", filename);

  const image = await Jimp.read(tmpPath);
  await image.resize(250, 250);
  await image.writeAsync(tmpPath);

  const publicPath = path.resolve("./public/avatars", filename);

  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    await fs.unlink(publicPath);
  }

  const user = await Users.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: tmpPath },
    { new: true }
  );
  res.json({
    avatarUrl: user.avatarUrl,
  });
};

module.exports = {
  uploadController,
};
