const express = require("express");
const studyMaterialRouter = express.Router();

const {
  createStudyMaterial,
  getAllStudyMaterial,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
  uploadFile,
} = require("../controllers/studyMaterialController.js");

studyMaterialRouter.post(
  "/add-study-material",
  uploadFile,
  createStudyMaterial
);
studyMaterialRouter.get("/all-study-material", getAllStudyMaterial);
studyMaterialRouter.get("/get-study-material/:id", getStudyMaterialById);
studyMaterialRouter.put(
  "/update-study-material/:id",
  uploadFile,
  updateStudyMaterial
);
studyMaterialRouter.delete("/delete-study-material/:id", deleteStudyMaterial);

module.exports = studyMaterialRouter;
