import atob from "atob";
global.atob = atob;

import axios from "axios";
import { Farmbot } from "farmbot";

import PhotoSequence from "./sequences/photoSequence.js";
import CameraClient from "./CameraMqttClient.js";

/* FarmbotManager


*/
export default class FarmbotManager {
  farmbot = undefined;
  farmbotInformation = {};

  cameraMqttClient = undefined;

  isExecuting = false;

  constructor(email, password) {
    this.farmbotInformation.email = email;
    this.farmbotInformation.password = password;
  }

  async connect() {
    if (await this.getAuthToken()) {
      this.farmbot = new Farmbot({
        token: this.farmbotInformation.authToken,
        secure: true,
      });

      await this.farmbot.connect();
      console.log("Connected to Farmbot")
      // this.connectToCameraMqtt();
    }
  }

  /*  getAuthToken
      Returns the Farmbot_id and Farmbot token by posting a request on my.farm.bot/api/tokens 
      The Farmbot token is used for communicating with the Farmbot
  */
  async getAuthToken() {
    try {
      const reponse = await axios.post("https://my.farm.bot/api" + "/tokens", {
        user: {
          email: this.farmbotInformation.email,
          password: this.farmbotInformation.password,
        },
      });

      this.farmbotInformation.id = reponse.data.token.unencoded.bot;
      this.farmbotInformation.authToken = reponse.data.token.encoded;

      return true;
    } catch (err) {
      console.log("Error email or password invalid");
      console.log(err)
      return false;
    }
  }

  connectToCameraMqtt() {
    this.cameraMqttClient = new CameraClient(this.farmbotInformation.id);
  }

  /*  performDataSequence()
      Starts the sequence of collecting the data out of the field
  */
  performDataSequence() {
    console.log(this.isExecuting)
    return new Promise(async (resolve, reject) => {
      console.log(this.isExecuting)
      if (!this.isExecuting) {
        console.log("Starting Data Sequence");
        this.isExecuting = true;

        const sequence = new PhotoSequence(
          this.farmbot,
          this.cameraMqttClient,
          this.farmbotInformation
        );
        
        try {
          await sequence.performSequence();
        }
        catch(err) {
          console.log(err)
        }
       
        this.isExecuting = false;
      }
      resolve();
    });
  }

  /*  performWaterSequence()
      Starts the sequence of watering all the plants within the field
  */
  performWaterSequence() {
    return new Promise(async (resolve, reject) => {
      if (!this.isExecuting) {
        console.log("Starting Water Sequence");
        this.isExecuting = true;

        const sequence = new WaterSequence(
          this.farmbot,
          this.farmbotInformation
        );

        try {
          await sequence.performWateringSequence();
        } catch (err) {
          console.log(err);
        }

        this.isExecuting = false;
      }

      resolve();
    });
  }
}

/*  WaterSequence

*/
class WaterSequence {
  water_nozzle = {};

  plants = [];
  locations = [];

  constructor(farmbot, farmbotInformation) {
    this.farmbot = farmbot;
    this.farmbotInformation = farmbotInformation;
  }

  /*  performWateringSequence()
      Collects the locations of the tools and plants. Then it starts the watering action.
  */
  async performWateringSequence() {
    const tools = await this.fetchTools();
    const locations = await this.fetchLocations();

    if(tools == undefined){
      console.log(Date.now())
      console.log("Fetching of tools returned undefined object")
      console.log("tools: " + tools)
      return
    }

    if(locations == undefined){
      console.log(Date.now())
      console.log("Fetching of locations return undefined object")
      console.log("locations: " + locations)
      return
    }

    this.filterPlants(locations);
    this.filterTools(tools, locations);

    return this.performAction();
  }

  /*  fetchTools()
      Fetches all the tools that are within the field.
  */
  async fetchTools() {
    try {
      const response = await axios.get("https://my.farm.bot/api" + "/tools", {
        headers: {
          Authorization: this.farmbotInformation.authToken,
        },
      });

      return response.data;
    } catch (err) {
      console.log(err);
      console.log(`No ToolSlots found`);
    }
  }

  /*  fetchLocations()
      Fetches all the points within the field with their data.
  */
  async fetchLocations() {
    try {
      const response = await axios.get("https://my.farm.bot/api" + "/points", {
        headers: {
          Authorization: this.farmbotInformation.authToken,
        },
      });

      return response.data;
    } catch (err) {
      console.log(err);
      console.log(`No plant points found`);
    }
  }

  /*  filterPlants(locations)
      Creates a list of planted plants, sorted based on their coordinates.
  */
  filterPlants(locations) {
    this.plants = locations.filter((point) => {
      return point.pointer_type === "Plant" && point.plant_stage === "planted";
    });

    this.plants.sort((a, b) => {
      if (a.x === b.x) {
        return a.y - b.y;
      }
      return a.x - b.x;
    });
  }

  /*  filterTools(tools, locations)
      Returns the data of the water nozzle, so the coordinates from the Watering Nozzle can be retained.
  */
  filterTools(tools, locations) {
    const wateringNozzleId = tools.filter((tool) => {
      return tool.name === "Watering Nozzle";
    })[0].id;

    this.water_nozzle = locations.filter((location) => {
      return location.tool_id === wateringNozzleId;
    })[0];
  }

  /*  pickUpTool()
      Picks up the Watering Nozzle.
  */
  async pickUpTool() {
    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x,
      y: this.water_nozzle.y,
      z: 0,
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x,
      y: this.water_nozzle.y,
      z: this.water_nozzle.z,
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150,
      y: this.water_nozzle.y,
      z: this.water_nozzle.z,
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150,
      y: this.water_nozzle.y,
      z: 0,
    });
  }

  /*  putBackTool()
      Puts back the Watering Nozzle.
  */
  async putBackTool() {
    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150,
      y: this.water_nozzle.y,
      z: 0,
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150,
      y: this.water_nozzle.y,
      z: this.water_nozzle.z - 2,
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x,
      y: this.water_nozzle.y,
      z: this.water_nozzle.z - 2,
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x,
      y: this.water_nozzle.y,
      z: 0,
    });

    await this.farmbot.moveAbsolute({
      x: 0,
      y: 100,
      z: 0,
    });
  }

  /*  giveWater(milliseconds)
      Toggles the pin of the water, then toggles it again after x milliseconds. 
  */
  giveWater(milliseconds) {
    return new Promise(async (resolve, reject) => {
      await this.farmbot.togglePin({ pin_number: 8 });
      setTimeout(async () => {
        await this.farmbot.togglePin({ pin_number: 8 });
        resolve();
      }, milliseconds);
    });
  }

  /*  performAction()
      Picks up the Watering nozzle,
      then moves the Farmbot over the location of the plants, watering each location within the plants list,
      finally returns the Watering Nozzle.
  */
  performAction() {
    return new Promise(async (resolve, reject) => {
      // try {
      //   await this.pickUpTool();
      // }
      // catch(err) {
      //   console.log(err)
      // }

      for (const plantIndex in this.plants) {
        await this.farmbot.moveAbsolute({
          x: this.plants[plantIndex].x,
          y: this.plants[plantIndex].y,
          z: 0,
          speed: 100,
        });

        try {
          await this.giveWater(2000);
        }
        catch(err) {
          console.log(err)
        }
      }

      // try {
      //   await this.putBackTool();
      // }
      // catch(err) {
      //   console.log(err)
      // }
      
      resolve();
    });
  }
}
