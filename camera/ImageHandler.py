import requests
import cv2
import queue, threading


class ImageHandler:

    def __init__(self, config, tunnel):
        self.config = config
        self.imageQueue = queue.Queue(100)
        self.tunnel = tunnel
        self.workerThread = threading.Thread(target=self.workerTask, args=(self.imageQueue, self.tunnel, self.config))
        self.workerThread.start()

    def workerTask(self, queue, tunnel, config):
        while True:
            image = queue.get()

            if config.ssh_tunneling is True:
                if tunnel.isTunnelAlive() is False:
                    print("Reconnecting to the tunnel")
                    tunnel.reconnectTunnel()

            print(f"Processing image with id: {image[0]}")

            enc_success, image_jpg = cv2.imencode(".WEBP", image[1])
            binary_image = image_jpg.tobytes()

            try:
                headers = {'Content-type': 'application/octet-stream'}
                image_endpoint = f"{config.webhookUrl}/image?messageId={image[0]}"
                requests.post(url=image_endpoint, data=binary_image, headers=headers)
            except Exception as e:
                print(str(e))

    def addImage(self, imageTuple):
        self.imageQueue.put(imageTuple)
        print(self.imageQueue.qsize())
