const ClassSchedule = require("../models/classSchedule");
const Employee = require("../models/employee");
const Subject = require("../models/addSubject");
const Class = require("../models/addClass");
const Section = require("../models/addSection");

// 📌 Add a new class schedule
const addClassSchedule = async (req, res) => {
    try {
        const { teacherName, subject, class: classId, section, timeStamp, selectDays } = req.body;

        // Check if referenced IDs exist
        const subjectExists = await Subject.findById(subject);
        const employeeExists = await Employee.findById(teacherName);
        const classExists = await Class.findById(classId);
        const sectionExists = await Section.findById(section);

        if (!subjectExists) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        if (!employeeExists) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        if (!classExists) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        if (!sectionExists) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        const newClassSchedule = new ClassSchedule({
            teacherName,
            subject,
            class: classId,
            section,
            timeStamp,
            selectDays,
        });

        await newClassSchedule.save();

        res.status(201).json({
            success: true,
            message: "Class schedule added successfully",
            data: newClassSchedule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get all class schedules with filtering
const getAllClassSchedules = async (req, res) => {
    try {
        const { page = 1, limit = 10, className, sectionName, subjectName, teacherAssigned } = req.query;

        const query = {};
        if (teacherAssigned) query.teacherName = teacherAssigned;

        // First fetch all data with population
        let classSchedules = await ClassSchedule.find(query)
            .populate("subject")
            .populate("class")
            .populate("section")
            .populate("teacherName")
            .sort({ createdAt: -1 });

        // Filter by className if provided
        if (className) {
            classSchedules = classSchedules.filter(item =>
                item.class?.name?.toLowerCase().includes(className.toLowerCase())
            );
        }

        // Filter by sectionName if provided
        if (sectionName) {
            classSchedules = classSchedules.filter(item =>
                item.section?.name?.toLowerCase().includes(sectionName.toLowerCase())
            );
        }

        // Filter by subjectName if provided
        if (subjectName) {
            classSchedules = classSchedules.filter(item =>
                item.subject?.subjectName?.toLowerCase().includes(subjectName.toLowerCase())
            );
        }

        const total = classSchedules.length;
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const paginatedData = classSchedules.slice(startIndex, startIndex + parseInt(limit));

        res.status(200).json({
            success: true,
            data: paginatedData,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get class schedule by ID
const getClassScheduleById = async (req, res) => {
    try {
        const classSchedule = await ClassSchedule.findById(req.params.id)
            .populate("subject", "subjectName")
            .populate("class", "name")
            .populate("section", "name");

        if (!classSchedule) {
            return res.status(404).json({ success: false, message: "Class schedule not found" });
        }
        res.status(200).json({ success: true, data: classSchedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update a class schedule
const updateClassSchedule = async (req, res) => {
    try {
        const { teacherName, subject, class: classId, section, timeStamp, selectDays } = req.body;

        // Check if referenced IDs exist (only if provided)
        if (subject && !(await Subject.findById(subject))) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        if (teacherName && !(await Employee.findById(teacherName))) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        if (classId && !(await Class.findById(classId))) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        if (section && !(await Section.findById(section))) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        const updatedClassSchedule = await ClassSchedule.findByIdAndUpdate(
            req.params.id,
            { $set: { teacherName, subject, class: classId, section, timeStamp, selectDays } },
            { new: true, runValidators: true }
        );

        if (!updatedClassSchedule) {
            return res.status(404).json({ success: false, message: "Class schedule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Class schedule updated successfully",
            data: updatedClassSchedule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 📌 Delete a class schedule
const deleteClassSchedule = async (req, res) => {
    try {
        const deletedClassSchedule = await ClassSchedule.findByIdAndDelete(req.params.id);
        if (!deletedClassSchedule) {
            return res.status(404).json({ success: false, message: "Class schedule not found" });
        }
        res.status(200).json({ success: true, message: "Class schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addClassSchedule,
    getAllClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
};
