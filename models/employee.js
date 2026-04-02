// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    aadhar: { type: String },
    dateOfBirth: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bloodGroup: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Married", "Unmarried", "Divorced", "Widow"],
    },
    nationality: { type: String },
    religion: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },

    profile: { type: String },
    alternativeNumber: { type: Number },
    blockId: {
      type: Boolean,
    },
    delete: {
      type: Boolean,
    },
    amount: [],
    // Update the subject field to reference Subject model
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // refers to the Subject model
      // Field is optional because we haven't added "required: true"
    },
    employeeAddress: {
      employeeLine1: { type: String },
      employeeLine2: { type: String },
      city: { type: String },
      state: { type: String },
    },
    officialDetails: {
      employeeId: { type: String },
      joiningDate: { type: Date },
      department: { type: String },
      desigantion: { type: String },
      qualification: { type: String },
      salary: { type: Number },
      increment: { type: Number },
      experience: { type: String },
    },
    attendance: [
      {
        date: { type: Date },
        status: { type: String, enum: ["Present", "Absent"] },
      },
    ],
    salaryRecords: [
      {
        month: { type: Number },
        year: { type: Number },
        amount: { type: Number },
        status: {
          type: String,
          enum: ["Paid", "Due", "Pending"],
          default: "Pending",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
