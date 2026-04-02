const mongoose = require("mongoose");

const StudyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    materialFile: { type: String, required: true }, // Will store file path or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyMaterial", StudyMaterialSchema);
