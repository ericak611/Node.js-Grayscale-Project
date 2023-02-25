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