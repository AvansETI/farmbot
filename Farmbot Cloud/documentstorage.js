const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');

class DocumentStorage {

    constructor(credentialsFilePath) {
        this.db = new Firestore({
            projectId: 'farmbot-avans-cloud',
            keyFilename: credentialsFilePath
        })
    }

    async writePlant(image_id, plant_name) {
        const docRef = this.db.collection('Plants').doc(uuidv4());

        await docRef.set({
            image_id: image_id,
            plant_name: plant_name,
        });
    }

    async printPlants() {
        const snapshot = await this.db.collection('Plants').get();
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    }

}

module.exports = DocumentStorage;