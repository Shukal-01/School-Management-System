const express = require("express");
const departmentRouter = express.Router();
const {
  addDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController.js");

departmentRouter.post("/add-department", addDepartment);
departmentRouter.get("/all-department", getAllDepartment);
departmentRouter.get("/get-department/:id", getDepartmentById);
departmentRouter.put("/update-deparment/:id", updateDepartment);
departmentRouter.delete("/delete-department/:id", deleteDepartment);

module.exports = departmentRouter;
