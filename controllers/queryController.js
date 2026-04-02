const Query = require("../models/query.js");

// ✅ Submit a Query (Parent, Teacher, or Student)
const submitQuery = async (req, res) => {
  try {
    const { senderId, senderRole, message } = req.body;

    const newQuery = new Query({
      senderId,
      senderRole,
      message,
    });

    await newQuery.save();
    res
      .status(201)
      .json({ message: "Query submitted successfully", query: newQuery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Queries (For Admin)
const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Queries by User ID
const getUserQueries = async (req, res) => {
  try {
    const { senderId } = req.params;
    const queries = await Query.find({ senderId });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin Responds to a Query
const respondToQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { adminResponse } = req.body;

    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    query.adminResponse = adminResponse;
    query.status = "Resolved";
    await query.save();

    res.status(200).json({ message: "Query resolved successfully", query });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitQuery,
  getAllQueries,
  getUserQueries,
  respondToQuery,
};
