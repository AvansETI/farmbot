const { initializeApp, cert } = require("firebase-admin/app")
const { getStorage } = require("firebase-admin/storage")

class MediaStorage {

    constructor(credentialsFilePath){

        initializeApp({
            credential: cert(require(credentialsFilePath)),
            storageBucket: 'farmbot-avans-cloud.appspot.com/'
        })
    }

    async uploadImage(file, subdirectory) {
        var bucket = getStorage().bucket();

        await bucket.upload( 'images/' + file, {
            destination: subdirectory + file
        })
    }
    
}

module.exports = MediaStorage;