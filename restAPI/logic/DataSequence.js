import atob from "atob";
global.atob = atob;

import { Farmbot } from "farmbot";
import axios from "axios";

import CameraClient from "./CameraMqttClient.js";
import WaterSequence from "./WaterSequence.js";
import config from "../config.js";

export default class FarmbotManager {
  farmbot = undefined;
  farmbotInformation = {};

  cameraMqttClient = undefined;

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

  async performDataSequence() {
    const sequence = new DataSequence(
      this.farmbot,
      this.cameraMqttClient,
      this.farmbotInformation
    );

    await sequence.performCameraSequence();
  }

  async performWaterSequence() {

    const sequence = new DataSequence(
      this.farmbot,
      null,
      this.farmbotInformation,
    );

    await sequence.performWateringSequence();
  }
}

class DataSequence {
  constructor(farmbot, cameraClient, farmbotInformation) {
    this.farmbot = farmbot;
    this.cameraClient = cameraClient;
    this.farmbotInformation = farmbotInformation;
  }

  async performCameraSequence() {
    await this.fetchPlantsLocations();

    this.cameraClient.addResponseFunction(async () => {
      await this.performCameraStep();
    });

    await this.performCameraStep();

    // if (await this.bootJetson()) {
    //   //   await setTimeout(this.performStep, 120000);
    // } else {
    //   //call function immediatly
    //   //   await this.performCameraStep();
    // }
  }

  async performWateringSequence() {
    await this.fetchPlantsLocations();
    await this.fetchToolLocations();
    await this.fetchTools();
    
    this.waterSequence = new WaterSequence(
      this.farmbot,
      this.tools,
      this.waterNozzle
    );

   await this.waterSequence.pickUpNozzle();

    await this.performWaterStep();

    await this.waterSequence.putBackNozzle();

  }

  //   async bootJetson() {
  //     try {
  //       await this.farmbot.writePin({ pin_number: 10, value: 255 });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  async fetchPlantsLocations() {
    try {
      const response = await axios.get("https://my.farm.bot/api" + "/points", {
        headers: {
          Authorization: this.farmbotInformation.authToken,
        },
      });

      this.points = response.data.filter((point) => {
        return (
          point.pointer_type === "Plant" && point.plant_stage === "planted"
        );
      });

      this.points.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1 )
      
    } catch (err) {
      console.log(err);
      console.log(`No plant points found`);
    }
  }

  async fetchToolLocations() {
    try {
      const response = await axios.get("https://my.farm.bot/api" + "/points", {
        headers: {
          Authorization: this.farmbotInformation.authToken,
        },
      });

      this.tools = response.data.filter((point) => {
        return (
          point.pointer_type === "ToolSlot"
        );
      });

      this.tools.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1 )
    } catch (err) {
      console.log(err);
      console.log(`No ToolSlots found`);
    }
  }

  async fetchTools() {
    try {
      const response = await axios.get("https://my.farm.bot/api" + "/tools", {
        headers: {
          Authorization: this.farmbotInformation.authToken,
        },
      });

       const wateringNozzle = response.data.filter((point) => 
          point.name == "Watering Nozzle"
        );
        
        this.waterNozzle = wateringNozzle[0];
        console.log(this.waterNozzle);

    } catch (err) {
      console.log(err);
      console.log(`No ToolSlots found`);
    }
  }

  async performCameraStep() {
    if (this.points.length === 0) {
      return;
    }

    const firstLocation = this.points[0];

    await this.farmbot.moveAbsolute({
      x: firstLocation.x,
      y: firstLocation.y,
      z: 0,
      speed: 100,
    });
    this.points = this.points.slice(1, this.points.length);

    await this.cameraClient.takePicture();
  }

  async performWaterStep() {
    if (this.points.length === 0) {
      return;
    }

    const firstLocation = this.points[0];

    await this.farmbot.moveAbsolute({
      x: firstLocation.x,
      y: firstLocation.y,
      z: 0,
      speed: 100,
    });
    this.points = this.points.slice(1, this.points.length);

    await this.waterSequence.giveWater();
  }
}
