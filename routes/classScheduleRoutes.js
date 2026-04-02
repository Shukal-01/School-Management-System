const express = require("express");
const {
  addClassSchedule,
  getAllClassSchedules,
  getClassScheduleById,
  updateClassSchedule,
  deleteClassSchedule,
} = require("../controllers/classScheduleController");

const classScheduleRouter = express.Router();

classScheduleRouter.post("/add-schedule", addClassSchedule);
classScheduleRouter.get("/all-schedule", getAllClassSchedules);
classScheduleRouter.get("/get-schedule/:id", getClassScheduleById);
classScheduleRouter.put("/update-class/:id", updateClassSchedule);
classScheduleRouter.delete("/delete-class/:id", deleteClassSchedule);

module.exports = classScheduleRouter;
