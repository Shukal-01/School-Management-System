const NoticeBoard = require("../models/noticeBoard");

// 📌 Add a new notice
const addNotice = async (req, res) => {
    try {
        const { sendTo, title, details, categoryTag } = req.body;

        const newNotice = new NoticeBoard({
            sendTo,
            title,
            details,
            categoryTag
        });

        await newNotice.save();

        res.status(201).json({
            success: true,
            message: "Notice added successfully",
            data: newNotice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Get all notices with filtering, searching, and pagination
const getAllNotices = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoryTag, title, sendTo, search } = req.query;
        const query = {};

        // Filtering by categoryTag (Exact Match)
        if (categoryTag) {
            query.categoryTag = { $regex: categoryTag, $options: "i" };
        }

        // Filtering by sendTo (Exact Match or Array Match)
        if (sendTo) {
            query.sendTo = { $regex: sendTo, $options: "i" };
        }

        if (title) {
            query.title = { $regex: title, $options: "i" };
        }

        // Searching across all fields
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { details: { $regex: search, $options: "i" } },
                { categoryTag: { $regex: search, $options: "i" } },
                { sendTo: { $regex: search, $options: "i" } } // Searching in array field
            ];
        }

        // Fetch notices with pagination and sorting
        const notices = await NoticeBoard.find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Get total count of notices matching query
        const total = await NoticeBoard.countDocuments(query);

        res.status(200).json({
            success: true,
            data: notices,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllNotices };


// 📌 Get notice by ID
const getNoticeById = async (req, res) => {
    try {
        const notice = await NoticeBoard.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }
        res.status(200).json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update notice
const updateNotice = async (req, res) => {
    try {
        const { sendTo, title, details, categoryTag } = req.body;

        const updatedNotice = await NoticeBoard.findByIdAndUpdate(
            req.params.id,
            { sendTo, title, details, categoryTag },
            { new: true }
        );

        if (!updatedNotice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notice updated successfully",
            data: updatedNotice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete notice
const deleteNotice = async (req, res) => {
    try {
        const deletedNotice = await NoticeBoard.findByIdAndDelete(req.params.id);
        if (!deletedNotice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }
        res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addNotice,
    getAllNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
};
