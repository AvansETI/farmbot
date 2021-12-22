const {Storage} = require('@google-cloud/storage');
const config = require('./config')

class MediaStorage {

    constructor(){
        this.storage = new Storage()
    }

    async uploadImage(file, subdirectory) {
        await this.storage.bucket(config.bucketName).upload('images/ + file', {
            destination: subdirectory + file
        })
    }
}

module.exports = MediaStorage;