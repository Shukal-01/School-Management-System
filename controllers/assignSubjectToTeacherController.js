const AssignSubjectToTeacher = require("../models/assignSubjectToTeacher");
const Class = require("../models/addClass");
const Employee = require("../models/employee");
const Subject = require("../models/addSubject");

// 📌 Assign Subject to a Teacher
const assignSubject = async (req, res) => {
    try {
        // Expect subject and teacher as references (ObjectIds)
        const { selectClass, subjectName, teacherName, sendNotificationToTeacher } = req.body;

        // Validate existence of Class, Teacher, and Subject
        const classExists = await Class.findById(selectClass);
        if (!classExists) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const teacherExists = await Employee.findById(teacherName);
        if (!teacherExists) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        const subjectExists = await Subject.findById(subjectName);
        if (!subjectExists) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        // Check if the subject is already assigned to this class
        const assignmentExists = await AssignSubjectToTeacher.findOne({ subjectName, selectClass });
        if (assignmentExists) {
            return res
                .status(400)
                .json({ success: false, message: "Subject already assigned to this class" });
        }

        const newAssignment = new AssignSubjectToTeacher({
            selectClass,
            subjectName,
            teacherName,
            sendNotificationToTeacher: sendNotificationToTeacher || false,
        });

        await newAssignment.save();

        res.status(201).json({
            success: true,
            message: "Subject assigned to teacher successfully",
            data: newAssignment,
        });

        // 📌 Send notification to teacher (optional)
        if (sendNotificationToTeacher) {
            console.log(
                `Notification sent to teacher ${teacherExists.firstName} ${teacherExists.lastName}`
            );
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get all assigned subjects
const getAllAssignedSubjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, selectClass, teacher, search = "" } = req.query;
        const query = {};

        if (selectClass) query.selectClass = selectClass;
        if (teacher) query.teacherName = teacher;

        let assignedSubjects = await AssignSubjectToTeacher.find(query)
            .populate("selectClass")
            .populate("subjectName")
            .populate("teacherName")
            .populate("subjectCode")
            .sort({ createdAt: -1 })
            .lean(); // Lean enables us to treat documents like plain JS objects

        // 🔍 Filter after population
        if (search) {
            const regex = new RegExp(search, "i");
            assignedSubjects = assignedSubjects.filter((item) => {
                return (
                    regex.test(item.selectClass?.name) ||
                    regex.test(item.subjectName?.subjectCode) ||
                    regex.test(item.teacherName?.firstName) ||
                    regex.test(item.teacherName?.lastName)
                );
            });
        }

        const total = assignedSubjects.length;

        // Manual Pagination
        const paginatedResults = assignedSubjects.slice(
            (page - 1) * limit,
            page * limit
        );

        res.status(200).json({
            success: true,
            data: paginatedResults,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get assigned subject by ID
const getAssignedSubjectById = async (req, res) => {
    try {
        const assignedSubject = await AssignSubjectToTeacher.findById(req.params.id)
            .populate("selectClass")
            .populate("subjectName")
            .populate("teacherName")

        if (!assignedSubject) {
            return res
                .status(404)
                .json({ success: false, message: "Assigned subject not found" });
        }

        res.status(200).json({ success: true, data: assignedSubject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update assigned subject
const updateAssignedSubject = async (req, res) => {
    try {
        // Expect updated fields as references
        const { selectClass, subjectName, teacherName, sendNotificationToTeacher } = req.body;

        const updatedAssignment = await AssignSubjectToTeacher.findByIdAndUpdate(
            req.params.id,
            { selectClass, subjectName, teacherName, sendNotificationToTeacher },
            { new: true }
        )
            .populate("selectClass")
            .populate("subjectName")
            .populate("teacherName")

        if (!updatedAssignment) {
            return res
                .status(404)
                .json({ success: false, message: "Assigned subject not found" });
        }

        res.status(200).json({
            success: true,
            message: "Assigned subject updated successfully",
            data: updatedAssignment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete assigned subject
const deleteAssignedSubject = async (req, res) => {
    try {
        const deletedAssignment = await AssignSubjectToTeacher.findByIdAndDelete(req.params.id);
        if (!deletedAssignment) {
            return res
                .status(404)
                .json({ success: false, message: "Assigned subject not found" });
        }
        res.status(200).json({ success: true, message: "Assigned subject deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    assignSubject,
    getAllAssignedSubjects,
    getAssignedSubjectById,
    updateAssignedSubject,
    deleteAssignedSubject,
};
