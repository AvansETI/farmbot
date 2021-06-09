import atob from "atob";
global.atob = atob;

import axios from "axios";
import { Farmbot } from "farmbot";

import PhotoSequence from "./sequences/photoSequence.js"
import CameraClient from "./cameraMqttClient.js";

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

  performDataSequence() {
    const sequence = new PhotoSequence(
      this.farmbot,
      this.cameraMqttClient,
      this.farmbotInformation
    );

    return sequence.performSequence();
  }

  performWaterSequence() {}
}
