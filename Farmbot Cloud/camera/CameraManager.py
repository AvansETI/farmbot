import cv2


class CameraManager:
    videoCamera = None

    def __init__(self, port, config):
        self.config = config
        self.open(port)

    def open(self, port):
        self.videoCamera = cv2.VideoCapture(port)

        self.videoCamera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.videoCamera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    def take_picture(self):
        if self.videoCamera.isOpened() is False:
            return False, 0

        return self.videoCamera.read()

    def close(self):
        self.videoCamera.release()