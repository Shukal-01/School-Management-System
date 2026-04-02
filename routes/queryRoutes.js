const express = require("express");
const {
  submitQuery,
  getAllQueries,
  getUserQueries,
  respondToQuery,
} = require("../controllers/queryController.js");

const router = express.Router();

// 📌 Submit a query (Parent, Teacher, or Student)
router.post("/submit", submitQuery);

// 📌 Get all queries (Admin)
router.get("/all", getAllQueries);

// 📌 Get queries for a specific user (Parent, Teacher, or Student)
router.get("/user/:senderId", getUserQueries);

// 📌 Admin responds to a query
router.put("/respond/:queryId", respondToQuery);

module.exports = router;
