const {Storage} = require('@google-cloud/storage');
const config = require('./config')

class MediaStorage {

    constructor(){
        this.storage = new Storage()
    }

    async uploadImage(file, subdirectory, targetFilePath) {
        await this.storage.bucket(config.bucketName)
        .upload(file, {
            destination: subdirectory + targetFilePath
        })
        .catch((reason) => {
            console.log("Error writing file to storage bucket")
            console.log(reason)
        })
    }
}

module.exports = MediaStorage;