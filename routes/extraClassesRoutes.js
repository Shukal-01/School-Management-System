const express = require("express");
const {
    addExtraClass,
    getAllExtraClasses,
    getExtraClassById,
    updateExtraClass,
    deleteExtraClass,
} = require("../controllers/extraClassesController");

const extraClassesRouter = express.Router();

extraClassesRouter.post("/add-class", addExtraClass);
extraClassesRouter.get("/all-classes", getAllExtraClasses);
extraClassesRouter.get("/get-class/:id", getExtraClassById);
extraClassesRouter.put("/update-class/:id", updateExtraClass);
extraClassesRouter.delete("/delete-class/:id", deleteExtraClass);

module.exports = extraClassesRouter;
