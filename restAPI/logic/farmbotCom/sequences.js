global.atob     = require("atob");

let axios       = require("axios").default;
let config      = require('../../config.json');
let validation  = require('./setup');
let movement    = require('./movement');
let setup       = require('./setup');

function sequencePhoto() {
    validation.getPointsList().forEach(function(point){
        if(point.pointer_type == "Plant" && point.plant_stage == "planted")
        {
          console.log(`${point.x + " , " + point.y}`);
          movement.moveFarmbot(point.x, point.y, 0, 100, true);
       }
    })
}

function sequenceWater()
{
    movement.mountTool("water_nozzle")
    validation.getPointsList().forEach(function(point){
        if(point.pointer_type == "Plant" && point.plant_stage == "planted")
        {
           movement.moveFarmbot(point.x, point.y, 0, 100)
           movement.giveWater(1000)
        }
    })
    movement.unmountTool("water_nozzle")
    farmbot.moveAbsolute({x: 0, y: 0, z: 0, speed: 100})
}

module.exports = {
    sequencePhoto,
    sequenceWater
}
