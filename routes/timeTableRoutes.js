const express = require('express');

const timeTableRouter = express.Router();

const {
    createTimeTable,
    getAllTimeTables,
    getTimeTableById,
    updateTimeTable,
    deleteTimeTable
} = require('../controllers/timeTableController.js');

// Create a new timetable entry
timeTableRouter.post('/add-timeTable', createTimeTable);
// Get all timetable entries with optional filtering and pagination
timeTableRouter.get('/all-timeTable', getAllTimeTables);
// Get a single timetable entry by ID
timeTableRouter.get('/get-timeTable/:id', getTimeTableById);
// Update a timetable entry by ID
timeTableRouter.put('/update-timeTable/:id', updateTimeTable);
// Delete a timetable entry by ID
timeTableRouter.delete('/delete-timeTable/:id', deleteTimeTable);

module.exports = timeTableRouter;