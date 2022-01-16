from calendar import month
import os
from flask import Flask, request
from google.cloud import storage
import torch
import yaml
import cv2
import numpy as np
import datetime

app = Flask(__name__)
classification_model = None

STORAGE_BUCKET_NAME = "farmbot-avans-cloud.appspot.com"
DESTINATION_FOLDER = "Classifications/"
IMAGE_EXTENSION = ".jpg"


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
    image_url = blob.public_url

    # Dont worry about this line, just a little bit of string slicing
    file_name = incoming_json['filepath'].split('/')[-1].split('.')[0]

    classification_model = torch.hub.load(
        'yolo', 'custom', path='best.pt', source='local')

    results = classification_model(image_url)

    img = results.render()
    # print(img[0]) <-- image als array?
    # converteren naar blob en opslaan in cloud storage
    local_filepath = '/classification/{name}{extension}'.format(
        name=file_name, extension=IMAGE_EXTENSION)
    cv2.imwrite(local_filepath, img[0])

    dateTuple = datetime.datetime.now().timetuple()
    date = "{day}-{month}-{year}".format(day = dateTuple[2], month = dateTuple[1], year = dateTuple[0])

    target_filepath = DESTINATION_FOLDER + date + "/" + file_name

    classification_blob = bucket.blob(target_filepath + IMAGE_EXTENSION)
    classification_blob.upload_from_filename(local_filepath)

    metadata_blob = bucket.blob(target_filepath + ".txt")
    metadata_blob.upload_from_string(results.pandas().xyxy[0].to_json(orient="records"))

    return { 
        "message": "Succesfully saved Classifications",
        "Image": target_filepath + IMAGE_EXTENSION,
        "Labels": target_filepath + ".txt"
    }


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
    classification_model = torch.hub.load(
        'yolo', 'custom', path='best.pt', source='local')
