from CameraManager import CameraManager
from Configuration import Configurations
from ImageHandler import ImageHandler
from MqttManager import MqttManager
from SshTunnel import SshTunnel

if __name__ == "__main__":
    config = Configurations()
    tunnel = SshTunnel(config)
    handler = ImageHandler(config, tunnel)
    camera = CameraManager(0, config)

    if config.ssh_tunneling is True:
        try:
            tunnel.connectTunnel()
        except:
            print("Ssh tunnel is not working at the moment")

    try:
        MqttManager(camera, config, handler)
    except Exception as e:
        print(e)
        exit(-1)
