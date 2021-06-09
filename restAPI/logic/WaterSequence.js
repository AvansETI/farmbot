import mqtt from "mqtt";

import config from "../config.js";

export default class performWaterSequence {
  responseFunction = undefined;
  farmbot = undefined;
  water_nozzle;
  tools = [];
  waitingForResponse = false;
  error = undefined;

  constructor(farmbot, tools, water_nozzle) {
    this.farmbot = farmbot;
    this.tools = tools;
    this.water_nozzle = this.tools.filter((tool) => {
      return tool.tool_id === water_nozzle.id
      })[0];

      console.log(this.water_nozzle.x);
  }

  async pickUpNozzle() {
    if (this.water_nozzle === undefined) {
      return this.error;
    }
    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x, 
      y: this.water_nozzle.y,
      z: 0 
    });
    
    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x, 
      y: this.water_nozzle.y,
      z: this.water_nozzle.z
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150, 
      y: this.water_nozzle.y,
      z: this.water_nozzle.z
    });
  }

  async putBackNozzle() {
    if (this.water_nozzle = undefined) {
      return this.error;
    }

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150, 
      y: this.water_nozzle.y,
      z: 0 
    });
    
    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x + 150, 
      y: this.water_nozzle.y,
      z: this.water_nozzle.z
    });

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x, 
      y: this.water_nozzle.y,
      z: this.water_nozzle.z
    })

    await this.farmbot.moveAbsolute({
      x: this.water_nozzle.x, 
      y: this.water_nozzle.y,
      z: 0 
    });
  }

  async giveWater() {
    console.log(this.farmbotId);
    await this.farmbot.togglePin({
      pin_number: 8
    });
    await this.wait()
    await this.farmbot.togglePin({
      pin_number: 8
    });
  }

  async wait() {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > 1000) {
            break;
        }
    }
  
  }
}
