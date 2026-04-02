const express = require("express");
const sessionRouter = express.Router();

const {
  addSession,
  getAllSession,
  getSessionById,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController.js");

sessionRouter.post("/add-session", addSession);
sessionRouter.get("/all-session", getAllSession);
sessionRouter.get("/get-session/:id", getSessionById);
sessionRouter.put("/update-session/:id", updateSession);
sessionRouter.delete("/delete-session/:id", deleteSession);

module.exports = sessionRouter;
