const express = require("express");
const examScheduleRouter = express.Router();

const {
    addExamSchedule,
    getAllExamSchedules,
    getExamScheduleById,
    updateExamSchedule,
    deleteExamSchedule,
} = require("../controllers/examScheduleController");

// Create a new exam schedule
examScheduleRouter.post("/add-schedule", addExamSchedule);

// Get all exam schedules with pagination (and optional filtering)
examScheduleRouter.get("/all-schedule", getAllExamSchedules);

// Get a single exam schedule by ID
examScheduleRouter.get("/get-schedule/:id", getExamScheduleById);

// Update an exam schedule by ID
examScheduleRouter.put("/update-schedule/:id", updateExamSchedule);

// Delete an exam schedule by ID
examScheduleRouter.delete("/delete-schedule/:id", deleteExamSchedule);

module.exports = examScheduleRouter;
