from email.mime import image
import os
from flask import Flask, request
from google.cloud import storage
import torch
import yaml
import cv2
import numpy as np

app = Flask(__name__)
classification_model = None

STORAGE_BUCKET_NAME = "farmbot-avans-cloud.appspot.com"


@app.route('/')
def get_data():
    return "Hello World!"


@app.route('/classify', methods=['POST'])
def classify_image():
    incoming_json = request.get_json()
    print(incoming_json['filepath'])

    client = storage.Client()
    bucket = client.bucket(STORAGE_BUCKET_NAME)
    blob = bucket.blob(incoming_json['filepath'])
    print("Blob: "+ blob)
    image_url = blob.public_url
    print(image_url)

    classification_model = torch.hub.load(
        'yolo', 'custom', path='best.pt', source='local')

    results = classification_model(image_url)

    # img = results.render()
    # print(img[0]) <-- image als array?
    # converteren naar blob en opslaan in cloud storage

    boxes = results.xyxyn
    # boxes ook opslaan in cloud firestore? format boxes --> [x,y,x,y,n] is een tensor
    print(boxes)

    return "Good test 🚀"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
    classification_model = torch.hub.load(
        'yolo', 'custom', path='best.pt', source='local')
