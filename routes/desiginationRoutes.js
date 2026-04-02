const express = require("express");
const desiginationRouter = express.Router();
const {
  addDesignation,
  getAllDesignation,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} = require("../controllers/designationController.js");

desiginationRouter.post("/add-designations", addDesignation);
desiginationRouter.get("/all-designations", getAllDesignation);
desiginationRouter.get("/get-designations/:id", getDesignationById);
desiginationRouter.put("/update-designations/:id", updateDesignation);
desiginationRouter.delete("/delete-designations/:id", deleteDesignation);

module.exports = desiginationRouter;
