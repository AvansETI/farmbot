import requests
import cv2

URL = "localhost:3000/image"
imgUrl = 'testimages/rutte.jpg'

image = cv2.imread(imgUrl)

enc_success, image_jpg = cv2.imencode(".JPG", image)
binary_image = image_jpg.tobytes()
headers = {'Content-type': 'image/jpg'}

try:
    requests.post(
        url=URL,
        data=binary_image,
        headers=headers
    )
except Exception as e:
                print(str(e))