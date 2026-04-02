const TimeTable = require('../models/timeTable'); // Adjust the path as necessary

// Controller functions

// Create a new timetable entry
const createTimeTable = async (req, res) => {
    try {
        const { startTime, endTime, description } = req.body;
        const newEntry = await TimeTable.create({ startTime, endTime, description });
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all timetable entries with pagination, filtering & searching
const getAllTimeTables = async (req, res) => {
    try {
        const { page = 1, limit = 10, startTime, endTime, search } = req.query;
        const query = {};

        if (startTime) query.startTime = startTime;
        if (endTime) query.endTime = endTime;
        if (search) query.description = { $regex: search, $options: 'i' };

        const entries = await TimeTable.find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await TimeTable.countDocuments(query);

        res.status(200).json({
            success: true,
            data: entries,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get a single timetable entry by ID
const getTimeTableById = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await TimeTable.findById(id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a timetable entry by ID
const updateTimeTable = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedEntry = await TimeTable.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedEntry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a timetable entry by ID
const deleteTimeTable = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await TimeTable.findByIdAndDelete(id);
        if (!deletedEntry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Import necessary modules

module.exports = {
    createTimeTable,
    getAllTimeTables,
    getTimeTableById,
    updateTimeTable,
    deleteTimeTable,
};
