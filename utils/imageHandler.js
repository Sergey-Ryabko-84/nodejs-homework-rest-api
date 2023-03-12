const Jimp = require("jimp");

const imageHandler = async (pathToImage) => {
      await Jimp
        .read(pathToImage)
        .then((image) => image.cover(250, 250).write(pathToImage))
        .catch((err) => {
          console.error(err);
        });
};

module.exports = imageHandler;