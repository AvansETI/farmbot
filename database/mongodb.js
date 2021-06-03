function connect(mongoose) {
    
    PlantSchema = new Schema({
      name        : String,
      id : Number
    });
    mongoose.model('Plant', PlantSchema);
}

module.exports.make = make;