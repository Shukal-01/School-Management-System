const express = require('express');
const religionRouter = express.Router();

const { addReligion, getAllReligion, getReligionById, updateReligion, deleteReligion } = require('../controllers/religionController.js');

religionRouter.post('/add-religion', addReligion);
religionRouter.get('/all-religion', getAllReligion);
religionRouter.get('/get-religion/:id', getReligionById);
religionRouter.put('/update-religion/:id', updateReligion);
religionRouter.delete('/delete-religion/:id', deleteReligion);

module.exports = religionRouter;