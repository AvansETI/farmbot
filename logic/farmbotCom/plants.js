global.atob     = require("atob");

let axios       = require("axios").default;
let config      = require('../../config.json');
let validation  = require('./setup');

function addPlant(plant)
{
  axios
  .post(API_URL + "/points", {
    headers: {
      'Authorization': `${validation.token}`
  },
    payload: plant,
    // payload: {
    //   'name': plant.name,
    //   'pointer_type': plant.pointer_type,
    //   'x': plant.x,
    //   'y': plant.y,
    //   'z': plant.z,
    //   'plant_stage': plant.plant_stage
    // }
})
  .then(function (resp) {
    var plant = resp;
    validation.pointsList.push(plant);
    console.log(`add plant...`);
    })
  .catch(function (err) {

    console.log(`Bad plant data...!`);
 });
}

module.exports = {
    addPlant
}