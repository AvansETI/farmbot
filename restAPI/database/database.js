import mongoose from 'mongoose';

/*  savePlant(point, responseCamera, responseMeasurement)
    Saves a plant within the database with the necessary info. See plantSchema for the data within the model.
*/
function savePlant(point, responseCamera, responseMeasurement) {
  var today = new Date();
  
  const plant = plantModel({
    id : point.id,
    plant_type : point.openfarm_slug,
    planted_at: point.planted_at, 
    
    image_date : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    image_id : responseCamera.hasOwnProperty("messageId") ? responseCamera.messageId : null,
    
    humidity: responseMeasurement.hasOwnProperty("humidity") ? responseMeasurement.humidity : null,
    temperature: responseMeasurement.hasOwnProperty("temperature") ? responseMeasurement.temperature : null,
  });

  plant.save(function (err, saved) {
    if (err) return console.log(err);
    return console.log("Saved");
  });
}

/* 
    The functions below are used to get certain data out of the database
    plantIDs -> returns all the ID's within the database
    allPlantTypes -> returns all the plant types within the database
    getPlants -> Returns all the data of the plants within the database
    getPlant -> Returns all the data of a certain plant (based on ID)
    getPlantType -> Returns all the data of a certain plant type
*/
async function plantIds() {
  return await plantModel.find({}).select({_id: 0, id: 1}); 
}

async function allPlantTypes() {
  return await plantModel.find().distinct('plant_type');
}

async function getPlants(offset = 0, limit = 10) {
  return await plantModel.find().skip(+offset).limit(+limit);
}

async function getPlant(id, offset = 0, limit = 10) {
  return await plantModel.find({id: +id}).skip(+offset).limit(+limit);
}

async function getPlantType(plant_type) {
  return await plantModel.find({plant_type: plant_type});
}

/*  plantSchema
    The structure of the data within the database.
    CHANGE IF DATA STRUCTURE CHANGES. ALSO CHANGE savePlant()
*/
const plantSchema = new mongoose.Schema({
  plant_type : String,
  id : Number,
  planted_at: String, 
  image_date : String,
  image_id : String,
  humidity: Number,
  temperature: Number
});

const plantModel = mongoose.model('Plant', plantSchema);

export {plantModel, savePlant, getPlants, allPlantTypes, plantIds, getPlant, getPlantType}