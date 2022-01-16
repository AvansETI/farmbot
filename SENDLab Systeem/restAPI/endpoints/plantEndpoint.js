import express from "express";

import { getPlants, allPlantTypes, plantIds, getPlant, getPlantType } from "./../database/database.js";

const router = express.Router();

/*
    get the data out of the API. See database.js for the corresponding functions.
*/
router.get('/', async (req, res) => {
    res.json(await getPlants(req.query.offset, req.query.amount))
})

router.get('/type', async (req, res) => {
    res.json(await allPlantTypes())
})

router.get('/filter', async (req, res) => {
    res.json(await getPlant(req.query.id, req.query.offset, req.query.amount))
})
  
router.get('/id', async (req, res) => {
    res.json(await plantIds());
})

router.get('/plant_type', async (req, res) => {
    res.json(await getPlantType(req.query.plant_type))
})

export default router;