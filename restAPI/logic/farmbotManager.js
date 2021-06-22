import atob from "atob";
global.atob = atob;

import axios from "axios";
import { Farmbot } from "farmbot";

import PhotoSequence from "./sequences/photoSequence.js";
import CameraClient from "./cameraMqttClient.js";

export default class FarmbotManager {
  farmbot = undefined;
  farmbotInformation = {};

  cameraMqttClient = undefined;

  constructor(email, password, database) {
    this.farmbotInformation.email = email;
    this.farmbotInformation.password = password;
    this.database = database;
  }

  async connect() {
    if (await this.getAuthToken()) {
      this.farmbot = new Farmbot({
        token: this.farmbotInformation.authToken,
        secure: true,
      });

      await this.farmbot.connect();
      this.connectToCameraMqtt();
    }
  }

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
      return false;
    }
  }

  connectToCameraMqtt() {
    this.cameraMqttClient = new CameraClient(this.farmbotInformation.id);
  }

  performDataSequence() {
    const sequence = new PhotoSequence(
      this.farmbot,
      this.cameraMqttClient,
      this.farmbotInformation,
      this.database
    );

    return sequence.performSequence();
  }

  performWaterSequence() {
    const sequence = new WaterSequence(this.farmbot, this.farmbotInformation);

    return sequence.performWateringSequence();
  }
}

class WaterSequence {
  water_nozzle = {};

  plants = [];
  locations = [];

  constructor(farmbot, farmbotInformation) {
    this.farmbot = farmbot;
    this.farmbotInformation = farmbotInformation;
  }

  async performWateringSequence() {
    const tools = await this.fetchTools();
    const locations = await this.fetchLocations();

    console.log(locations);

    this.filterPlants(locations);
    this.filterTools(tools, locations);

    this.waterSequence = new WaterSequence(
      this.farmbot,
      this.tools,
      this.waterNozzle
    );

    return this.performAction();
  }

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

  filterTools(tools, locations) {
    const wateringNozzleId = tools.filter((tool) => {
      return tool.name === "Watering Nozzle";
    })[0].id;

    this.water_nozzle = locations.filter((location) => {
      return location.tool_id === wateringNozzleId;
    })[0];
  }

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
  }

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
      y: 0,
      z: 0,
    });
  }

  giveWater(miliseconds) {
    return new Promise(async (resolve, reject) => {
      await this.farmbot.togglePin({ pin_number: 8 });
      setTimeout(async () => {
        await this.farmbot.togglePin({ pin_number: 8 });
        return resolve();
      }, miliseconds);
    });
  }

  performAction() {
    return new Promise(async (resolve, reject) => {
      await this.pickUpTool();

      for (const plantIndex in this.plants) {
        await this.farmbot.moveAbsolute({
          x: this.plants[plantIndex].x,
          y: this.plants[plantIndex].y,
          z: 0,
          speed: 100,
        });

        await this.giveWater(2000);
      }

      await this.putBackTool();

      return resolve();
    });
  }
}
