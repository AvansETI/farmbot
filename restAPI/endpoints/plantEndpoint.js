import express from "express";

import { getPlants, allPlantTypes, plantIds } from "../database/database.js";

const router = express.Router();

router.get('/', async (req, res) => {
    res.json(await getPlants(req.query.offset, req.query.amount))
})

router.get('/type', async (req, res) => {
    res.json(await allPlantTypes())
})
  
router.get('/id', async (req, res) => {
    res.json(await plantIds());
})

export default router;