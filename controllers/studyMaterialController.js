const StudyMaterial = require("../models/studyMaterial.js");
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

// Create a new StudyMaterial
const createStudyMaterial = async (req, res) => {
  try {
    const { title, description, classId, sectionId, materialFile } = req.body;

    const newSyllabus = new StudyMaterial({
      title,
      description,
      classId,
      sectionId,
      materialFile,
    });
    await newSyllabus.save();

    res.status(201).json(newSyllabus);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all syllabus records
const getAllStudyMaterial = async (req, res) => {
  try {
    const syllabusList = await StudyMaterial.find();
    res.status(200).json(syllabusList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get syllabus by ID
const getStudyMaterialById = async (req, res) => {
  try {
    const syllabus = await StudyMaterial.findById(req.params.id).populate(
      "classId sectionId"
    );
    if (!syllabus)
      return res.status(404).json({ message: "Syllabus not found" });

    res.status(200).json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update syllabus
const updateStudyMaterial = async (req, res) => {
  try {
    const { title, description, classId, sectionId } = req.body;
    const materialFile = req.file ? req.file.path : undefined;

    const updatedData = { title, description, classId, sectionId };
    if (materialFile) updatedData.materialFile = materialFile;

    const updatedSyllabus = await StudyMaterial.findByIdAndUpdate(
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
const deleteStudyMaterial = async (req, res) => {
  try {
    const deletedSyllabus = await StudyMaterial.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSyllabus)
      return res.status(404).json({ message: "Syllabus not found" });

    res.status(200).json({ message: "Syllabus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload middleware
const uploadFile = upload.single("materialFile");

module.exports = {
  createStudyMaterial,
  getAllStudyMaterial,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
  uploadFile,
};
