const express = require("express");
const sectionRouter = express.Router();

const { addSection, getAllSection, getSectionById, updateSection, deleteSection } = require("../controllers/addSectionController.js");

sectionRouter.post("/add-section", addSection);
sectionRouter.get("/all-section", getAllSection);
sectionRouter.get("/get-section/:id", getSectionById);
sectionRouter.put("/update-section/:id", updateSection);
sectionRouter.delete("/delete-section/:id", deleteSection);

module.exports = sectionRouter;