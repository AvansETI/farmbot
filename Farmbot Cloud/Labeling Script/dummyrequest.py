import requests
import cv2

# TODO change url to the url of the server/container
URL = "url/image?messageId=08c22ba3-3835-439f-80a7-7c942db106f3"
imgUrl = 'testimages/biet.jpg'

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
    print(response)
    print(response.content)
except Exception as e:
                print("error")
                print(str(e))
