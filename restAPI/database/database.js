import mongoose from 'mongoose';

function savePlant(point, responseCamera, responseMeasurement) {
  var today = new Date();
  
  const plant = plantModel({
    id : point.id,
    plant_type : point.openfarm_slug,
    planted_at: point.planted_at, 
    
    image_date : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    image_id : JSON.parse(responseCamera).messageId.toString(),
    
    humidity: JSON.parse(responseMeasurement).humidity.toString(),
    temperature: JSON.parse(responseMeasurement).temperature.toString()
  });

  plant.save(function (err, saved) {
    if (err) return console.log(err);
    return console.log("Saved");
  });
}

async function plantIds() {
  return await plantModel.find({}, 'id'); 
}

async function allPlantTypes() {
  return await plantModel.find().distinct('plant_type');
}

async function getPlants(offset = 0, limit = 10) {
  return await plantModel.find().skip(+offset).limit(+limit);
}

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

export {plantModel, savePlant, getPlants, allPlantTypes, plantIds}