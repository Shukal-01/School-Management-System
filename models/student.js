const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    aadhaar: { type: String },
    bloodGroup: { type: String },
    nationality: { type: String },
    caste: { type: String },
    religion: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: true, unique: true },
    userProfile: { type: String },
    phoneNumber: { type: String, required: true },
    isBlocked: { type: Boolean },
    isDeleted: { type: Boolean },
    address1: { type: String },
    address2: { type: String },
    city_district: { type: String },
    state_province: { type: String },
    admissionNumber: { type: String },
    rollNo: { type: String },
    currentSession: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // Link
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }, // Link
    joiningDate: { type: Date },
    discountPercent: { type: String },
    tutionFee: { type: String },
    isBusTransport: { type: String },
    routeNo: { type: String },
    studentCredentials: {
      id: { type: String },
      password: { type: String },
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" }, // Link to the parent
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
