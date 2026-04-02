const ExamCategory = require("../models/examCategory");

// 📌 Add a new exam category
const addExamCategory = async (req, res) => {
    try {
        const { examCategoryName, employeeName, establishedDate, remark } = req.body;

        const newExamCategory = new ExamCategory({
            examCategoryName,
            employeeName,
            establishedDate,
            remark,
        });

        await newExamCategory.save();

        res.status(201).json({
            success: true,
            message: "Exam category added successfully",
            data: newExamCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllExamCategories = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            examCategoryName,
            employeeName,
            establishedDate,
            search,
        } = req.query;

        const query = {};

        // 🎯 Filters
        if (examCategoryName) {
            query.examCategoryName = { $regex: examCategoryName, $options: "i" };
        }

        if (employeeName) {
            query.employeeName = { $regex: employeeName, $options: "i" };
        }

        if (establishedDate) {
            query.establishedDate = establishedDate; // exact match; can add date range if needed
        }

        // 🔍 Global search on multiple fields
        if (search) {
            query.$or = [
                { examCategoryName: { $regex: search, $options: "i" } },
                { employeeName: { $regex: search, $options: "i" } },
            ];
        }

        const examCategories = await ExamCategory.find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await ExamCategory.countDocuments(query);

        res.status(200).json({
            success: true,
            data: examCategories,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 📌 Get exam category by ID
const getExamCategoryById = async (req, res) => {
    try {
        const examCategory = await ExamCategory.findById(req.params.id);
        if (!examCategory) {
            return res.status(404).json({ success: false, message: "Exam category not found" });
        }
        res.status(200).json({
            success: true,
            data: examCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update exam category
const updateExamCategory = async (req, res) => {
    try {
        const { examCategoryName, employeeName, establishedDate, remark } = req.body;

        const updatedExamCategory = await ExamCategory.findByIdAndUpdate(
            req.params.id,
            { examCategoryName, employeeName, establishedDate, remark },
            { new: true }
        );

        if (!updatedExamCategory) {
            return res.status(404).json({ success: false, message: "Exam category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Exam category updated successfully",
            data: updatedExamCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete exam category
const deleteExamCategory = async (req, res) => {
    try {
        const deletedExamCategory = await ExamCategory.findByIdAndDelete(req.params.id);
        if (!deletedExamCategory) {
            return res.status(404).json({ success: false, message: "Exam category not found" });
        }
        res.status(200).json({
            success: true,
            message: "Exam category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addExamCategory,
    getAllExamCategories,
    getExamCategoryById,
    updateExamCategory,
    deleteExamCategory,
};
