from CameraManager import CameraManager
from Configuration import Configurations
from ImageHandler import ImageHandler
from MqttCamera import MqttCamera
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="pubsub-service-account.json"

if __name__ == "__main__":
    config = Configurations()
    handler = ImageHandler(config)
    camera = CameraManager(config.camera_id, config)

    try:
        MqttCamera(camera, config, handler)
    except Exception as e:
        print(e)
        exit(-1)

