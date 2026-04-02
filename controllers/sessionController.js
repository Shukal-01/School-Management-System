const Session = require("../models/Session.js");

// Create a new session
const addSession = async (req, res) => {
  try {
    const { sessionName, isSessionOpen, startDate, endDate, description } = req.body;
    const newSession = new Session({ sessionName, isSessionOpen, startDate, endDate, description });
    await newSession.save();

    res.status(201).json({
      success: true,
      message: "Session added successfully",
      data: newSession,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all sessions with pagination and filtering
const getAllSession = async (req, res) => {
  try {
    const { page = 1, limit = 10, sessionName, isSessionOpen } = req.query;
    const query = {};

    // Filter by sessionName (case-insensitive partial match)
    if (sessionName) {
      query.sessionName = { $regex: sessionName, $options: "i" };
    }

    // Filter by session status if provided (expects "true" or "false" as string)
    if (typeof isSessionOpen !== "undefined") {
      query.isSessionOpen = isSessionOpen === "true";
    }

    const sessions = await Session.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Session.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      data: sessions, 
      total, 
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a session by id
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a session by id
const updateSession = async (req, res) => {
  try {
    const { sessionName, isSessionOpen, startDate, endDate, description } = req.body;
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { sessionName, isSessionOpen, startDate, endDate, description },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a session by id
const deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);
    if (!deletedSession) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addSession,
  getAllSession,
  getSessionById,
  updateSession,
  deleteSession,
};
