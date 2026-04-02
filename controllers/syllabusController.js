const Syllabus = require("../models/syllabus.js");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Create a new Syllabus
const createSyllabus = async (req, res) => {
  try {
    const { title, remarks, classId, subjectId, syllabusFile } = req.body;

    const newSyllabus = new Syllabus({
      title,
      remarks,
      classId,
      subjectId,
      syllabusFile,
    });

    await newSyllabus.save();
    res.status(201).json(newSyllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSyllabus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { searchClass, searchSubject, searchTitle } = req.query;

    // Build dynamic filter conditions
    const matchConditions = [];

    if (searchTitle) {
      matchConditions.push({
        title: { $regex: searchTitle, $options: 'i' },
      });
    }

    if (searchClass) {
      matchConditions.push({
        'class.name': { $regex: searchClass, $options: 'i' },
      });
    }

    if (searchSubject) {
      matchConditions.push({
        'subject.subjectName': { $regex: searchSubject, $options: 'i' },
      });
    }

    // Start building pipeline
    const aggregationPipeline = [
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class',
        },
      },
      { $unwind: '$class' },
      {
        $lookup: {
          from: 'sections', // or 'subjects' if your subject model is named differently
          localField: 'subjectId',
          foreignField: '_id',
          as: 'subject',
        },
      },
      {
        $unwind: {
          path: '$subject',
          preserveNullAndEmptyArrays: true, // allow null subject
        },
      },
    ];

    // Add dynamic match stage
    if (matchConditions.length > 0) {
      aggregationPipeline.push({
        $match: {
          $and: matchConditions,
        },
      });
    }

    // Add pagination stages
    aggregationPipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Fetch paginated data
    const syllabusList = await Syllabus.aggregate(aggregationPipeline);

    // Count total documents (without pagination)
    const countPipeline = aggregationPipeline.slice(0, -2); // remove skip & limit
    countPipeline.push({ $count: 'total' });

    const countResult = await Syllabus.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Final response
    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      syllabusList,
    });
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get syllabus by ID
const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id).populate(
      "classId subjectId"
    );
    if (!syllabus)
      return res.status(404).json({ message: "Syllabus not found" });

    res.status(200).json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update syllabus
const updateSyllabus = async (req, res) => {
  try {
    const { title, remarks, classId, subjectId, syllabusFile } = req.body;

    const updatedData = { title, remarks, classId, subjectId, syllabusFile };

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedSyllabus)
      return res.status(404).json({ message: "Syllabus not found" });

    res.status(200).json(updatedSyllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete syllabus
const deleteSyllabus = async (req, res) => {
  try {
    const deletedSyllabus = await Syllabus.findByIdAndDelete(req.params.id);
    if (!deletedSyllabus)
      return res.status(404).json({ message: "Syllabus not found" });

    res.status(200).json({ message: "Syllabus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload middleware
const uploadFile = upload.single("syllabusFile");

module.exports = {
  createSyllabus,
  getAllSyllabus,
  getSyllabusById,
  updateSyllabus,
  deleteSyllabus,
  uploadFile,
};
