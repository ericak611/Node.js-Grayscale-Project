const { pipeline, Transform } = require("stream");
const unzipper = require("unzipper"),
    fs = require("fs"),
    fsp = require("fs").promises,
    PNG = require("pngjs").PNG,
    path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
    return new Promise((resolve, reject) => {
        pipeline(
            fs.createReadStream(pathIn),
            unzipper.Extract({ path: pathOut }),
            (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
        .on('close', () => {
          resolve()
        });
    });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const readDir = (dir) => {
    return fsp.readdir(dir)
      .then((all_files) =>  all_files.filter(png => path.extname(png)));
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
    fs.createReadStream(pathIn)
    .pipe(
      new PNG({
        filterType: 4,
      })
    )
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;

          // invert color
          this.data[idx] = 255 - this.data[idx];
          this.data[idx + 1] = 255 - this.data[idx + 1];
          this.data[idx + 2] = 255 - this.data[idx + 2];

          // and reduce opacity
          this.data[idx + 3] = this.data[idx + 3] >> 1;
        }
      }
      this.pack().pipe(fs.createWriteStream(pathOut));
    });
};

module.exports = {
unzip,
readDir,
grayScale,
};