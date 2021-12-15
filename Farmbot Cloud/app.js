const fs = require("fs");
const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const express = require("express")
const bodyParser = require("body-parser")


const db = new Firestore({
  projectId: 'farmbot-avans-cloud',
  keyFilename: 'D:/Schooljaar4/Farmbot/farmbotfirebasecredentials.json',
});

async function writePlant(image_id, plant_name, database){
  const docRef = db.collection('Plants').doc(uuidv4());

  await docRef.set({
      image_id: image_id,
      plant_name: plant_name,
  });
}

async function printPlants(database){
  const snapshot = await db.collection('Plants').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

// Initialize express and define a port
const app = express()
const PORT = 3000
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

  fs.writeFile(`images/${photoId}.jpg`, req.body, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send();
  });
});


//printPlants(db)


