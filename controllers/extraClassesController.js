const ExtraClasses = require("../models/extraClasses");
const Class = require("../models/addClass");
const Employee = require("../models/employee");
const Section = require("../models/addSection");

// 📌 Add a new extra class
const addExtraClass = async (req, res) => {
    try {
        const { selectClass, subjectId, teacherAssigned, selectSection, selectDays, selectTimeStamp, selectDate } = req.body;

        // Check if referenced IDs exist
        const classExists = await Class.findById(selectClass);
        const teacherExists = await Employee.findById(teacherAssigned);
        const sectionExists = await Section.findById(selectSection);

        if (!classExists) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        if (!teacherExists) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        if (!sectionExists) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        const newExtraClass = new ExtraClasses({
            selectClass,
            subjectId,
            teacherAssigned,
            selectSection,
            selectDays,
            selectTimeStamp,
            selectDate,
        });

        await newExtraClass.save();

        res.status(201).json({
            success: true,
            message: "Extra class added successfully",
            data: newExtraClass,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get all extra classes with filtering
const getAllExtraClasses = async (req, res) => {
    try {
        const { page = 1, limit = 10, className, sectionName, teacherAssigned } = req.query;

        const query = {};

        if (teacherAssigned) query.teacherAssigned = teacherAssigned;

        // First query all, populate class and section
        let extraClasses = await ExtraClasses.find(query)
            .populate("selectClass")
            .populate("selectSection")
            .populate("teacherAssigned")
            .populate("subjectId")
            .sort({ createdAt: -1 });

        // Then filter by className or sectionName if provided
        if (className) {
            extraClasses = extraClasses.filter(item => 
                item.selectClass?.name?.toLowerCase().includes(className.toLowerCase())
            );
        }

        if (sectionName) {
            extraClasses = extraClasses.filter(item => 
                item.selectSection?.name?.toLowerCase().includes(sectionName.toLowerCase())
            );
        }

        const total = extraClasses.length;
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const paginatedData = extraClasses.slice(startIndex, startIndex + parseInt(limit));

        res.status(200).json({
            success: true,
            data: paginatedData,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get extra class by ID
const getExtraClassById = async (req, res) => {
    try {
        const extraClass = await ExtraClasses.findById(req.params.id)
        .populate("selectClass")
        .populate("selectSection")
        .populate("teacherAssigned")
        .populate("subjectId")

        if (!extraClass) {
            return res.status(404).json({ success: false, message: "Extra class not found" });
        }
        res.status(200).json({ success: true, data: extraClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update an extra class
const updateExtraClass = async (req, res) => {
    try {
        const { selectClass, subjectId, teacherAssigned, selectSection, selectDays, selectTimeStamp, selectDate } = req.body;

        const updatedExtraClass = await ExtraClasses.findByIdAndUpdate(
            req.params.id,
            { selectClass, subjectId, teacherAssigned, selectSection, selectDays, selectTimeStamp, selectDate },
            { new: true }
        );

        if (!updatedExtraClass) {
            return res.status(404).json({ success: false, message: "Extra class not found" });
        }

        res.status(200).json({
            success: true,
            message: "Extra class updated successfully",
            data: updatedExtraClass,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete an extra class
const deleteExtraClass = async (req, res) => {
    try {
        const deletedExtraClass = await ExtraClasses.findByIdAndDelete(req.params.id);
        if (!deletedExtraClass) {
            return res.status(404).json({ success: false, message: "Extra class not found" });
        }
        res.status(200).json({ success: true, message: "Extra class deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addExtraClass,
    getAllExtraClasses,
    getExtraClassById,
    updateExtraClass,
    deleteExtraClass,
};
