import requests
import cv2
import queue, threading


class ImageHandler:

    def __init__(self, config):
        self.config = config
        self.imageQueue = queue.Queue(100)

        self.keepWorking = True
        self.workerThread = threading.Thread(target=self.workerTask, daemon=True, args=(self.imageQueue, self.config))
        self.workerThread.start()

    def workerTask(self, queue, config):
        while True:
            image = queue.get()

            print(f"Processing image with id: {image[0]}")

            enc_success, image_jpg = cv2.imencode(".JPG", image[1])
            binary_image = image_jpg.tobytes()

            try:
                headers = {'Content-type': 'image/jpg'}
                image_endpoint = f"{config.webhookUrl}/image?messageId={image[0]}"
                requests.post(url=image_endpoint, data=binary_image, headers=headers)
            except Exception as e:
                print(str(e))

    def addImage(self, imageTuple):
        self.imageQueue.put(imageTuple)
        print(self.imageQueue.qsize())

