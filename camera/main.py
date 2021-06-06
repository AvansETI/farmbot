from CameraManager import CameraManager
from Configuration import Configurations
from ImageHandler import ImageHandler
from MqttManager import MqttManager
from SshTunnel import SshTunnel

if __name__ == "__main__":
    config = Configurations()
    tunnel = SshTunnel(config)
    handler = ImageHandler(config, tunnel)
    camera = CameraManager(1, config)

    if config.ssh_tunneling is True:
        tunnel.connectTunnel()

    MqttManager(camera, config, handler)
