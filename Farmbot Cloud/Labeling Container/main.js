const MediaStorage = require('./mediastorage')
const DocumentStorage = require('./documentstorage')

const config = require('./config')

const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const express = require("express")
const bodyParser = require("body-parser")

// Setup of storage connections
var media = new MediaStorage()
var documents = new DocumentStorage()

// Setup of image upload endpoint
const app = express()
const PORT = config.port
// Tell express to use body-parser's JSON parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(
  bodyParser.raw({
    inflate: true,
    limit: "15mb",
    type: "image/*",
  })
);
app.use(express.static("public"));


// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

app.post("/image", (req, res) => {
  const photoId = req.query.messageId;

  // fs.mkdir('./images', {}, (err) => {
  //   console.log("Error creating directory")
  //   console.log(err)
  //   res.status(500).send(err)
  // })
  // fs.mkdir('./images')

  fs.writeFile(`images/${photoId}.jpg`, req.body, (err) => {
    if (err) {
      console.log("Error writing file")
      console.log(err);
      res.status(500).send(err);
    }
  });

  // File lookup in the document database
  documents.searchImage(photoId).
  then((doc_data) => {

    // Extract plant type
    let plant_type = doc_data.plant_type

    // Insert image into the crop directory
    let file = `${photoId}.jpg`
    let targetdir = `${config.datasetTitle}/${plant_type}/`
    media.uploadImage(file, targetdir)

    // fs.rmdir('./images')
    // add status report on foto send for debugging and logging purposes
    res.status(200).send(`Succesfully saved ${file} in ${targetdir}`);
  })
  .catch((reason) => {
    res.status(500).send(reason)
  })
});