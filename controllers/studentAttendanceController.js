const StudentAttendance = require("../models/studentAttendance");
const Student = require("../models/student");
const Section = require("../models/addSection");
const Class = require("../models/addClass");
const Employee = require("../models/employee");

// 📌 Add new student attendance
const addStudentAttendance = async (req, res) => {
    try {
        const { studentId, sectionId, classId, teacherId, date, attendanceStatus } = req.body;

        // Validate references
        const student = await Student.findById(studentId);
        const section = await Section.findById(sectionId);
        const klass = await Class.findById(classId);
        const teacher = await Employee.findById(teacherId);

        if (!student || !section || !klass || !teacher) {
            return res.status(400).json({
                success: false,
                message: "Invalid student, section, class, or teacher ID.",
            });
        }

        const newAttendance = new StudentAttendance({
            studentId,
            sectionId,
            classId,
            teacherId,
            date,
            attendanceStatus,
        });

        await newAttendance.save();

        res.status(201).json({
            success: true,
            message: "Attendance recorded successfully",
            data: newAttendance,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get all attendance records with optional filters
const getAllStudentAttendance = async (req, res) => {
    try {
        const { page = 1, limit = 10, studentName, className, sectionName, date } = req.query;

        let attendanceRecords = await StudentAttendance.find()
            .populate("studentId")
            .populate("classId")
            .populate("sectionId")
            .populate("teacherId")
            .sort({ createdAt: -1 });

        // Filter if needed
        if (studentName) {
            attendanceRecords = attendanceRecords.filter(record =>
                `${record.studentId?.firstName} ${record.studentId?.lastName}`.toLowerCase().includes(studentName.toLowerCase())
            );
        }

        if (className) {
            attendanceRecords = attendanceRecords.filter(record =>
                record.classId?.name?.toLowerCase().includes(className.toLowerCase())
            );
        }

        if (sectionName) {
            attendanceRecords = attendanceRecords.filter(record =>
                record.sectionId?.name?.toLowerCase().includes(sectionName.toLowerCase())
            );
        }

        if (date) {
            const inputDate = new Date(date).toISOString().split("T")[0];
            attendanceRecords = attendanceRecords.filter(record =>
                new Date(record.date).toISOString().split("T")[0] === inputDate
            );
        }

        const total = attendanceRecords.length;
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const paginatedData = attendanceRecords.slice(startIndex, startIndex + parseInt(limit));

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

// 📌 Get attendance by ID
const getStudentAttendanceById = async (req, res) => {
    try {
        const attendance = await StudentAttendance.findById(req.params.id)
            .populate("studentId")
            .populate("classId")
            .populate("sectionId")
            .populate("teacherId");

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update an attendance record
const updateStudentAttendance = async (req, res) => {
    try {
        const { studentId, sectionId, classId, teacherId, date, attendanceStatus } = req.body;

        const updatedAttendance = await StudentAttendance.findByIdAndUpdate(
            req.params.id,
            { studentId, sectionId, classId, teacherId, date, attendanceStatus },
            { new: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            data: updatedAttendance,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete an attendance record
const deleteStudentAttendance = async (req, res) => {
    try {
        const deletedAttendance = await StudentAttendance.findByIdAndDelete(req.params.id);

        if (!deletedAttendance) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        res.status(200).json({ success: true, message: "Attendance deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addStudentAttendance,
    getAllStudentAttendance,
    getStudentAttendanceById,
    updateStudentAttendance,
    deleteStudentAttendance,
};
