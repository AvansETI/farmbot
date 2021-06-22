import mongoose from 'mongoose';

export default class database {

  db = undefined;
  PlantSchema = undefined;

  constructor(dbAddress, username, password) {
    this.dbAddress = dbAddress;
    this.username = username;
    this.password = password;
  }


  connect() {
      mongoose.connect(this.dbAddress, {
      pass: this.password,
      user: this.username,
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      });
  
     this.db = mongoose.connection;
  }

  createSchema() {
    this.PlantSchema = new mongoose.Schema({
      plant_type : String,
      id : Number,
      planted_at: String, 
      image_date : String,
      image_id : String,
      humidity: Number,
      temperature: Number
    });
    this.plant = mongoose.model('Plant', this.PlantSchema);
  }

  saveData(point, responseCamera, responseMeasurement) {
      var today = new Date();
      const plant = this.plant ({
        plant_type : point.openfarm_slug,
        id : point.id,
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

  availableIDs() {
    var query = this.plant.find({}, function(err, data) {
      console.log(data[0]);
      return data;
    }).select({_id: 0, id: 1});
  }

  getDataFromDatabase(id, offset, limit = 10) {
    var query = this.plant.find({id: id}, function(err, data) {
      console.log(data);
      return data;
    }).skip(offset).limit(limit);
  }
}

