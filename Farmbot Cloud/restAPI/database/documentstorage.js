import { Firestore } from '@google-cloud/firestore';
import { v4 as uuidv4 } from 'uuid';

export default class DocumentStorage {

    constructor() {
        this.db = new Firestore()
    }

    async writePlant(point, responseCamera, responseMeasurement) {
        const docRef = this.db.collection('Farmbot').doc(uuidv4());
        var today = new Date();

        await docRef.set({
            id : point.id,
            plant_type : point.openfarm_slug,
            planted_at: point.planted_at, 
            
            image_date : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
            image_id : responseCamera.hasOwnProperty("messageId") ? responseCamera.messageId : null,
            
            humidity: responseMeasurement.hasOwnProperty("humidity") ? responseMeasurement.humidity : null,
            temperature: responseMeasurement.hasOwnProperty("temperature") ? responseMeasurement.temperature : null,
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