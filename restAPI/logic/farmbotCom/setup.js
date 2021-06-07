global.atob    = require("atob");

let axios      = require("axios").default;
let Farmbot    = require("farmbot").Farmbot;
let config     = require('../../config');
let token;
let farmbot;
let pointsList = [];

function createToken(email, password) {
    axios
      .post(config.api.URL + "/tokens", {
        'user': {'email': email, 'password': password}
      })
      .then(function (resp) {
    
        token = resp.data.token.encoded;
        farmbot = new Farmbot({ token: token, secure: true });
        let farmbot_id = resp.data.token.unencoded.bot;
        console.log(`Got API Token from ${farmbot_id}...`);
        })
      .catch(function (err) {
    
        console.log(`E-mail or password not valid!`);
     });
}

function generatePoints() {
    if (token == null)  return console.log('Not connected to Farmbot');
    axios
  .get(config.api.URL + "/points", {
    headers: {
      'Authorization': `${token}`
  }})
  .then(function (resp) {
    pointsList.length = 0;
    for (var i = 0; i < resp.data.length; i++)
    {
      var plant = resp.data[i];
      if (plant.id ==  405567) plant.name = "Water_nozzle"
      if (pointsList.filter(function(point) { return point.x === plant.x && point.y == plant.y; }).length <= 0) pointsList.push(plant)
    }
    pointsList.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1 )
    pointsList.forEach(plant => console.log(plant.name + " , " + plant.id + "\nCoordinates: " + plant.x + " , " + plant.y + "\n" + plant.plant_stage));
  })
  .catch(function (err) {
    console.log(`No topic found with name ${topic}`);
  })
}

function connectFarmbot()
{
  farmbot.connect()
    .then(function() {
        console.log('Connection with Farmbot!')
        return farmbot.moveAbsolute({x: 0, y: 0, z: 0, speed: 100})
    })
    .catch(function (error) {
        console.log("Failed to connect with the Farmbot!")
    })
}

function getToken()
{
  return token;
}

function getPointsList()
{
  return pointsList;
}

function getFarmbot()
{
  return farmbot;
}
module.exports = {
    createToken,
    connectFarmbot,
    generatePoints,
    getToken,
    getPointsList,
    getFarmbot
}