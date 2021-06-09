import axios from "axios"

export default class PhotoSequence {
  constructor(farmbot, cameraClient, farmbotInformation) {
    this.farmbot = farmbot;
    this.cameraClient = cameraClient;
    this.farmbotInformation = farmbotInformation;
  }

  async performSequence() {
    await this.fetchPlantsLocations();

    if (!(await this.readStatus()).pins[10].value) {
      await this.farmbot.togglePin({ pin_number: 10 });
      setTimeout(async () => {
        return this.performStep();
      }, 120000);
    } else {
      return this.performStep();
    }
  }

  async readStatus() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.farmbot.readStatus({ pin_number: 10 });
        this.farmbot.on(
          "status",
          (data, eventname) => {
            return resolve(data);
          },
          true
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

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

      this.points.sort((a, b) => {
        if (a.x === b.x) {
          return a.y - b.y;
        }
        return a.x - b.x;
      });
    } catch (err) {
      console.log(err);
      console.log(`No plant points found`);
    }
  }

  performStep() {
    return new Promise(async (resolve, reject) => {
      for (const pointIndex in this.points) {
        try {
          await this.farmbot.moveAbsolute({
            x: this.points[pointIndex].x,
            y: this.points[pointIndex].y,
            z: 0,
            speed: 100,
          });

          const response = (await this.cameraClient.takePicture()).toString();

          //save data to database
        } catch (err) {
          console.log(err);
        }
      }
      await this.farmbot.moveAbsolute({ x: 0, y: 0, z: 0, speed: 100 });
      return resolve();
    });
  }
}
