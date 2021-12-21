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

    // Create a query against the collection for a specific image_id.
    async searchImage(image_id) {
        const plant_collection = this.db.collection('Plants');
        const snapshot = await plant_collection.where('image_id', '==', image_id).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        return snapshot.docs[0].data()
    }



}

module.exports = DocumentStorage;