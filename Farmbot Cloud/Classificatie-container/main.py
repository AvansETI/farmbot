import os
from flask import Flask, request
from google.cloud import storage
import torch
import yaml
import numpy as np

app = Flask(__name__)
model = None

STORAGE_BUCKET_NAME = "farmbot-avans-cloud.appspot.com"

@app.route('/')
def get_data():
    return "Hello World!"

@app.route('/classify', methods = ['POST'])
def classify_image():
    incoming_json = request.get_json()
    print(incoming_json['filepath'])

    client = storage.Client()
    bucket = client.bucket(STORAGE_BUCKET_NAME)
    blob = bucket.blob(incoming_json['filepath'])
    image_url = blob.public_url

    
    results = model(image_url)

    #img = results.render()
    boxes = results.xyxyn
    print(boxes)
    
    return "Good test 🚀"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
    model = torch.hub.load('yolo', 'custom', path='best.pt', source='local')