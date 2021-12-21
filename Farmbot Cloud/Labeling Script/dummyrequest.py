import requests
import cv2

URL = "http://localhost:3000/image?messageId=1234"
imgUrl = 'Farmbot Cloud/testimages/biet.jpg'

image = cv2.imread(imgUrl)

enc_success, image_jpg = cv2.imencode(".JPG", image)
binary_image = image_jpg.tobytes()
headers = {'Content-type': 'image/jpg'}

try:
    response = requests.post(
        url=URL,
        data=binary_image,
        headers=headers
    )
    print(str(response))
except Exception as e:
                print(str(e))