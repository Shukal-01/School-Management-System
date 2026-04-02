const express = require("express");
const classRouter = express.Router();

const {
  addClass,
  getAllClass,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/addClassController.js");

classRouter.post("/add-class", addClass);
classRouter.get("/all-class", getAllClass);
classRouter.get("/get-class/:id", getClassById);
classRouter.put("/update-class/:id", updateClass);
classRouter.delete("/delete-class/:id", deleteClass);

module.exports = classRouter;
