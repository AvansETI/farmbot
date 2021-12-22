from sshtunnel import SSHTunnelForwarder


class SshTunnel:
    def __init__(self, config):
        self.config = config

        self.server = SSHTunnelForwarder(
            (config.ssh_host, config.ssh_port),
            ssh_username=config.ssh_username,
            ssh_password=config.ssh_password,
            remote_bind_address=(config.ssh_remote_address, config.ssh_remote_port),
            local_bind_address=('127.0.0.1', config.ssh_local_port)
        )

    def connectTunnel(self):
        self.server.start()

    def isTunnelAlive(self):
        return self.server.is_alive

    def reconnectTunnel(self):
        self.server.restart()

    def closeTunnel(self):
        self.server.close()
