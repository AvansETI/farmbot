const MediaStorage = require('./mediastorage')
const DocumentStorage = require('./documentstorage')

const cors = require('cors')
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
app.use(cors());
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

app.get("/", (req, res) => {
  res.status(200).send("Farmbot labeling container")
})

app.post("/image", (req, res) => {
  const photoId = req.query.messageId;

  const localdir = `/tmp/images/`
  const photoPath = `${photoId}.jpg`

  console.log("Writing file to filesystem")
  fs.writeFile(localdir + photoPath, req.body, (err) => {
    if (err) {
      console.log("Error writing file")
      console.log(err);
      res.status(500).send(err);
    }
  });

  // File lookup in the document database
  console.log("Looking up image in firestore")
  documents.searchImage(photoId).
  then((doc_data) => {

    // Extract plant type
    let plant_type = doc_data.plant_type

    // Insert image into the crop directory
    console.log("Uploading image")
    let targetdir = `${config.datasetTitle}/${plant_type}/`
    media.uploadImage(localdir + photoPath, targetdir, photoPath)

    // add status report on foto send for debugging and logging purposes
    let response = {
      message: `Succesfully saved ${photoPath} in ${targetdir}`,
      filepath: targetdir + photoPath
    }
    res.status(200).send(response);
  })
  .catch((reason) => {
    console.log("Something went wrong")
    console.log(reason)
    res.status(500).send(reason)
  })
});