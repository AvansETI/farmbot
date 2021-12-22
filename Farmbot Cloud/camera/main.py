from CameraManager import CameraManager
from Configuration import Configurations
from ImageHandler import ImageHandler
from SshTunnel import SshTunnel
from MqttCamera import MqttCamera
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="pubsub-service-account.json"

if __name__ == "__main__":
    config = Configurations()
    tunnel = SshTunnel(config)
    handler = ImageHandler(config, tunnel)
    camera = CameraManager(config.camera_id, config)

    if config.ssh_tunneling is True:
        try:
            tunnel.connectTunnel()
        except:
            print("Ssh tunnel is not working at the moment")


    try:
        MqttCamera(camera, config, handler)
    except Exception as e:
        print(e)
        exit(-1)

