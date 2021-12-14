const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');


const db = new Firestore({
  projectId: 'farmbot-avans-cloud',
  keyFilename: 'D:/Schooljaar4/Farmbot/farmbotfirebasecredentials.json',
});


async function writePlant(image_id, plant_name){
    const docRef = db.collection('Plants').doc(uuidv4());

    await docRef.set({
        image_id: image_id,
        plant_name: plant_name,
    });
}

async function printPlants(){
    const snapshot = await db.collection('Plants').get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
}




writePlant(8387387, "banoplant")
printPlants()