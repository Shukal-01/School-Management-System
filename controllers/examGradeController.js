const ExamGrade = require("../models/examGrade");

// 📌 Add a new exam grade
const addExamGrade = async (req, res) => {
    try {
        const { gradeName, gradePoint, percentageForm, percentageUpto, remark } = req.body;

        const newExamGrade = new ExamGrade({
            gradeName,
            gradePoint,
            percentageForm,
            percentageUpto,
            remark,
        });

        await newExamGrade.save();

        res.status(201).json({
            success: true,
            message: "Exam grade added successfully",
            data: newExamGrade,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllExamGrades = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            gradeName,
            gradePoint,
            percentageForm,
            percentageUpto,
            search,
        } = req.query;

        const query = {};

        // 🎯 Filters
        if (gradeName) {
            query.gradeName = { $regex: gradeName, $options: "i" };
        }

        if (gradePoint) {
            query.gradePoint = gradePoint;
        }

        if (percentageForm) {
            query.percentageForm = percentageForm;
        }

        if (percentageUpto) {
            query.percentageUpto = percentageUpto;
        }

        // 🔍 Global search
        if (search) {
            query.$or = [
                { gradeName: { $regex: search, $options: "i" } },
                { remark: { $regex: search, $options: "i" } },
            ];
        }

        const examGrades = await ExamGrade.find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await ExamGrade.countDocuments(query);

        res.status(200).json({
            success: true,
            data: examGrades,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get exam grade by ID
const getExamGradeById = async (req, res) => {
    try {
        const examGrade = await ExamGrade.findById(req.params.id);
        if (!examGrade) {
            return res.status(404).json({ success: false, message: "Exam grade not found" });
        }
        res.status(200).json({ success: true, data: examGrade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update exam grade
const updateExamGrade = async (req, res) => {
    try {
        const { gradeName, gradePoint, percentageForm, percentageUpto, remark } = req.body;

        const updatedExamGrade = await ExamGrade.findByIdAndUpdate(
            req.params.id,
            { gradeName, gradePoint, percentageForm, percentageUpto, remark },
            { new: true }
        );

        if (!updatedExamGrade) {
            return res.status(404).json({ success: false, message: "Exam grade not found" });
        }

        res.status(200).json({
            success: true,
            message: "Exam grade updated successfully",
            data: updatedExamGrade,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete exam grade
const deleteExamGrade = async (req, res) => {
    try {
        const deletedExamGrade = await ExamGrade.findByIdAndDelete(req.params.id);
        if (!deletedExamGrade) {
            return res.status(404).json({ success: false, message: "Exam grade not found" });
        }
        res.status(200).json({ success: true, message: "Exam grade deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addExamGrade,
    getAllExamGrades,
    getExamGradeById,
    updateExamGrade,
    deleteExamGrade,
};
