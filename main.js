const path = require("path");
const { pipeline, Transform } = require("stream");

const {unzip, readDir, grayScale} = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");


unzip(zipFilePath, pathUnzipped)
    .then( ()  => readDir(pathUnzipped))
    .then(arr => arr.forEach(async (file) => {grayScale(path.join(pathUnzipped, file), path.join(pathProcessed, file))}))
    .catch(err => console.log(err))

