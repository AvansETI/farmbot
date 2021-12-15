const { initializeApp, cert } = require("firebase-admin/app")
const { getStorage } = require("firebase-admin/storage")

const serviceAccount = require('D:/farmbot-avans-cloud-firebase-adminsdk-r8r3d-9a5adaf0a5.json')

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'farmbot-avans-cloud.appspot.com/'
})

const bucket = getStorage().bucket();

// bucket.getFiles( (err, files) => {
//     if(!err){
//         for(file of files){
//             console.log(file.id)
//         }
//     }
// })

async function uploadImage(file, subdirectory) {
    await bucket.upload( 'images/' + file, {
        destination: subdirectory + file
    })
}

uploadImage('Zilean.jpg', 'lol/')

// 0b6bbb5e-c362-4b2a-8ca8-9a2cd7622d7c.jpg