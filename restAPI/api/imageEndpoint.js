import express from "express"

const router = express.Router();

router.post("/image", (req, res) => {
    console.log("received image")
    //save image to files system and database

    res.send()
})

export default router