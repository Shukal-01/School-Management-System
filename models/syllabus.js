const mongoose = require("mongoose");

const SyllabusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    remarks: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    syllabusFile: { type: String, required: true }, // Will store file path or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Syllabus", SyllabusSchema);
