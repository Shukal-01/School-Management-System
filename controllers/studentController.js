// controllers/studentController.js
const Student = require("../models/student.js");
const Parent = require("../models/parent.js");
const Employee = require("../models/employee.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
const { Types: { ObjectId } } = mongoose;

// Add a student
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
// For SMS, you can use a service like Twilio or any other SMS provider
const twilio = require("twilio");

// Get counts of students (total, male, female, transgender), employees, and parents
const getCounts = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const maleStudents = await Student.countDocuments({ gender: "Male" });
    const femaleStudents = await Student.countDocuments({ gender: "Female" });
    const transgenderStudents = await Student.countDocuments({
      gender: "Other",
    }); // assuming "Other" represents transgender

    const totalEmployees = await Employee.countDocuments();
    const totalParents = await Parent.countDocuments();

    res.status(200).json({
      success: true,
      message: "Counts retrieved successfully",
      data: {
        totalStudents,
        maleStudents,
        femaleStudents,
        transgenderStudents,
        totalEmployees,
        totalParents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// New Student and parent add api
const addStudent = async (req, res) => {
  console.log(req.body);
  try {
    const studentDetails = req.body.studentDetails;
    const parentDetails = req.body.parentDetails;

    // Ensure required environment variables are set
    if (!process.env.USER_EMAIL || !process.env.USER_PASS) {
      throw new Error(
        "Email configuration is missing in environment variables."
      );
    }
    if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
      console.warn(
        "Twilio credentials are not configured. SMS notifications will be skipped."
      );
    }

    // Generate unique IDs and passwords for the student (and new parent if required)
    const studentId = `${studentDetails.firstName}-${Date.now()}`;
    const studentPassword = `${studentDetails.firstName}@${Math.random()
      .toString(16)
      .slice(-6)}`;
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    // Check if parent already exists (using unique field like email)
    let parent = await Parent.findOne({
      parentEmail: parentDetails.parentEmail,
    });
    let parentId, parentPassword;

    if (parent) {
      // Parent exists, use the existing parent's _id
      parentId = parent.credentials.id; // assuming you want to use existing parent's credentials
      // Optionally, you might want to update some parent fields from parentDetails here
    } else {
      // Parent does not exist, create new parent
      parentId = `${parentDetails.parentFirstName}-${Date.now()}`;
      parentPassword = `${parentDetails.parentFirstName}@${Math.random()
        .toString(16)
        .slice(-6)}`;
      const hashedParentPassword = await bcrypt.hash(parentPassword, 10);
      parent = new Parent({
        ...parentDetails,
        credentials: {
          id: parentId,
          password: hashedParentPassword,
        },
        students: [], // initialize with empty array
      });
      parent = await parent.save(); // Save and retrieve the newly created parent
    }

    // Create new student and link to parent's _id
    const student = new Student({
      ...studentDetails,
      studentCredentials: {
        id: studentId,
        password: hashedStudentPassword,
      },
      parent: parent._id,
    });

    const savedStudent = await student.save();

    // If parent already exists, update its students array (if not already added)
    if (!parent.students.includes(savedStudent._id)) {
      parent.students.push(savedStudent._id);
      await parent.save();
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    // Compose email to parent
    let emailText = `
      Dear ${parentDetails.parentFirstName || "Parent"},

      Your child ${
        studentDetails.firstName || "Student"
      } has been successfully registered.

      Student Login Details:
      ID: ${studentId}
      Password: ${studentPassword}
    `;

    // If parent was created in this request, include parent credentials in email
    if (parentPassword) {
      emailText += `
      Parent Login Details:
      ID: ${parentId}
      Password: ${parentPassword}
      `;
    }

    emailText += `
      Regards,
      School Management
    `;

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: parentDetails.parentEmail,
      subject: "Welcome to Our School",
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    // (Optional) SMS Notification via Twilio can be added here
    const user = new User({
      name: `${studentDetails.firstName} ${studentDetails.lastName}`,
      email: studentDetails.email,
      userName: studentId,
      password: studentPassword,
      phone: studentDetails.phoneNumber,
      role: "student",
    });

    const user1 = new User({
      name: `${parentDetails.parentFirstName} ${parentDetails.parentLastName}`,
      email: parentDetails.parentEmail,
      userName: parentId,
      password: parentPassword,
      phone: parentDetails.parentPhone,
      role: "parent",
    });

    await user.save();
    await user1.save();

    res.status(201).json({
      message: "Student added successfully.",
      studentCredentials: { id: studentId, password: studentPassword },
      parentCredentials: parentPassword
        ? { id: parentId, password: parentPassword }
        : undefined,
      savedStudent,
      parent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res
      .status(500)
      .json({ message: "Error adding student", error: error.message });
  }
};

const addStudentWithExistingParentData = async (req, res) => {
  try {
    const studentDetails = req.body.studentDetails;

    // Validate that the studentDetails contain a parent field
    if (!studentDetails.parent) {
      return res
        .status(400)
        .json({ message: "Parent ID is required in studentDetails." });
    }

    // Fetch the existing parent by ID
    const parent = await Parent.findById(studentDetails.parent);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found." });
    }

    // Generate unique ID and password for the new student
    const studentId = `STU-${Date.now()}`;
    const studentPassword = `Stu@${Math.random().toString(36).slice(-6)}`;
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    // Create new student and link to the existing parent's _id
    const student = new Student({
      ...studentDetails,
      studentCredentials: {
        id: studentId,
        password: hashedStudentPassword,
      },
      parent: parent._id, // ensuring correct ObjectId reference
    });

    const savedStudent = await student.save();

    // Update parent's students array if not already added
    if (!parent.students.includes(savedStudent._id)) {
      parent.students.push(savedStudent._id);
      await parent.save();
    }

    // (Optional) Configure email transport and send email notification to the parent
    if (process.env.USER_EMAIL && process.env.USER_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS,
        },
      });

      const emailText = `
        Dear ${parent.parentFirstName || "Parent"},

        A new student (${
          studentDetails.firstName || "Student"
        }) has been successfully registered under your account.

        Student Login Details:
        ID: ${studentId}
        Password: ${studentPassword}

        Regards,
        School Management
      `;

      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: parent.parentEmail,
        subject: "New Student Registration",
        text: emailText,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      message: "Student added successfully under the existing parent.",
      studentCredentials: { id: studentId, password: studentPassword },
      savedStudent,
      parent,
    });
  } catch (error) {
    console.error("Error adding student with existing parent data:", error);
    res.status(500).json({
      message: "Error adding student with existing parent data",
      error: error.message,
    });
  }
};

const addMultipleStudentsForParent = async (req, res) => {
  try {
    const { parentId, students } = req.body;

    // Validate input: Ensure parentId and an array of students is provided
    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required." });
    }
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        message: "Students array is required and should not be empty.",
      });
    }

    // Fetch the existing parent by ID
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found." });
    }

    const addedStudents = [];

    // Process each student in the array
    for (const studentDetails of students) {
      // Generate a unique student ID using current timestamp and a random number for extra uniqueness
      const studentId = `STU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const studentPassword = `Stu@${Math.random().toString(36).slice(-6)}`;
      const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

      // Create new student and link to the parent's _id
      const student = new Student({
        ...studentDetails,
        studentCredentials: {
          id: studentId,
          password: hashedStudentPassword,
        },
        parent: parent._id,
      });

      const savedStudent = await student.save();
      addedStudents.push({
        savedStudent,
        credentials: { id: studentId, password: studentPassword },
      });

      // Add the new student's _id to the parent's students array
      parent.students.push(savedStudent._id);
    }

    // Save the updated parent record
    await parent.save();

    // Optionally: If needed, you can send a single summary email to the parent listing all new students.
    // (Email configuration and sending can be added here as per your requirement.)

    res.status(201).json({
      message:
        "Multiple students added successfully under the existing parent.",
      addedStudents,
      parent,
    });
  } catch (error) {
    console.error("Error adding multiple students for parent:", error);
    res.status(500).json({
      message: "Error adding multiple students for parent",
      error: error.message,
    });
  }
};

// update student by id
const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const data = req.body;

    // Build the update object mapping the incoming keys to schema fields
    const updateData = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.dateOfBirth) updateData.dob = data.dateOfBirth;
    if (data.bloodGroup) updateData.bloodGroup = data.bloodGroup;
    if (data.nationality) updateData.nationality = data.nationality;
    if (data.caste) updateData.caste = data.caste;
    if (data.religion) updateData.religion = data.religion;
    if (data.gender) updateData.gender = data.gender;
    if (data.email) updateData.email = data.email;
    if (data.userProfile) updateData.profile = data.userProfile;
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;

    // Map address fields if provided
    if (
      data.address1 ||
      data.address2 ||
      data.city_district ||
      data.state_province
    ) {
      updateData.studentAddress = {
        addressLine1: data.address1,
        addressLine2: data.address2,
        city: data.city_district,
        state: data.state_province,
      };
    }

    // Map official details if provided
    if (
      data.admissionNumber ||
      data.rollNo ||
      data.joiningDate ||
      data.class ||
      data.section
    ) {
      updateData.officialDetails = {
        admissionNo: data.admissionNumber,
        rollNo: data.rollNo,
        joiningDate: data.joiningDate,
        class: data.class,
        section: data.section,
        // currentSession is kept unchanged unless provided elsewhere
      };
    }

    // Perform the update operation
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

// Get students with filters and pagination
const getStudents = async (req, res) => {
  try {
    // console.log(req.query, "debug line 144");
    const {
      page = 1,
      limit = 10,
      search,
      class: classFilter,
      section,
    } = req.query;

    const filters = {
      isDeleted: { $ne: true }, // Exclude students with isDeleted: true
      isBlocked: { $ne: true }, // Exclude students with isBlocked: true
    };

    if (search) {
      filters.$or = [
        { firstName: new RegExp(search, "i") },
        { rollNo: new RegExp(search, "i") },
      ];
    }

    // Add filters for class and section if provided
    if (classFilter) filters.class = classFilter;
    if (section) filters.section = section;

    const students = await Student.find(filters, { studentCredentials: 0 }).populate("class").populate("section")
      // .populate("parent")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filters);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      students,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving students", error });
  }
};

// Get student by Id
const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId).populate("parent");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    console.error("Error retrieving student:", error);
    res
      .status(500)
      .json({ message: "Error retrieving student", error: error.message });
  }
};

// Export multiple students' data to Excel
const exportStudentsToExcel = async (req, res) => {
  try {
    const { ids } = req.body; // Expect an array of student IDs
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid IDs array" });
    }

    // Find students with IDs in the provided array
    const students = await Student.find({ _id: { $in: ids } });
    if (!students.length) {
      return res
        .status(404)
        .json({ message: "No students found for the given IDs" });
    }

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students Data");

    // Define the worksheet columns
    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 50 },
    ];

    // Add student data rows to the worksheet
    students.forEach((student, index) => {
      // Add a header row for the current student
      worksheet.addRow({ field: `Student ${index + 1}`, value: "" });

      // Convert the student document to a plain object and add each key/value pair
      Object.entries(student.toObject()).forEach(([key, value]) => {
        // If value is an object, stringify it for readability
        worksheet.addRow({
          field: key,
          value:
            typeof value === "object" ? JSON.stringify(value, null, 2) : value,
        });
      });

      // Add an empty row for separation
      worksheet.addRow({});
    });

    // Set the appropriate headers to force file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=students_data.xlsx"
    );

    // Write the workbook to the response stream and end the response
    await workbook.xlsx.write(res);
    // console.log("Students data exported to Excel successfully");
    res.end();
  } catch (error) {
    console.error("Error exporting students to Excel:", error);
    res.status(500).json({
      message: "Error exporting students to Excel",
      error: error.message,
    });
  }
};

// Block/Unblock or Delete/Revert a student
const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { action } = req.body; // Expected values: 'block', 'unblock', 'delete', 'revert'

    let updateData = {};

    // Build the update object based on the action
    switch (action) {
      case "block":
        updateData = { isBlocked: true /*, status: 'blocked'*/ };
        break;
      case "unblock":
        updateData = { isBlocked: false /*, status: 'active'*/ };
        break;
      case "delete":
        updateData = { isDeleted: true /*, status: 'deleted'*/ };
        break;
      case "revert":
        updateData = { isDeleted: false /*, status: 'active'*/ };
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    // Update the student document in one atomic operation
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: `Student ${action}ed successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student status:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const studentLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the student document by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if student is blocked or deleted
    if (student.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked. Please contact administration.",
      });
    }
    if (student.isDeleted) {
      return res.status(403).json({
        message: "Your account is deleted. Please contact administration.",
      });
    }

    // For a rough login, if the student exists and is active, return a success message.
    // In a production scenario, you'd check a password and issue a token.
    res.status(200).json({ message: "Login successful", student });
  } catch (error) {
    console.error("Error logging in student:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const promoteStudent = async (req, res) => {
  try {
    const {
      admissionNo,
      changeSection,
      currentSession,
      promoteSession,
      promotionFromClass,
      promotionToClass,
    } = req.body;

    // Validate required fields (currentSession is optional if student's record doesn't have it)
    if (
      !admissionNo ||
      !promoteSession ||
      !promotionFromClass ||
      !promotionToClass ||
      typeof changeSection === "undefined"
    ) {
      return res
        .status(400)
        .json({ message: "All required fields are not provided" });
    }

    // If changeSection is true, ensure newSection is provided
    if (!changeSection) {
      return res.status(400).json({
        message: "Change section is required!",
      });
    }

    // Find the student by admissionNumber
    const student = await Student.findOne({ admissionNumber: admissionNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Validate that the student's current class matches the promotionFromClass
    if (student.class !== promotionFromClass) {
      return res
        .status(400)
        .json({ message: "Student is not in the provided class" });
    }

    // If the student's currentSession is set, check it against the provided currentSession
    if (student.currentSession !== undefined && currentSession !== undefined) {
      if (student.currentSession !== currentSession) {
        return res
          .status(400)
          .json({ message: "Student is not in the provided current session" });
      }
    }

    // Build the update object
    const updateData = {
      currentSession: promoteSession,
      class: promotionToClass,
    };

    if (changeSection) {
      updateData.section = newSection;
    }

    // Perform the update directly in the database and return the updated document
    const updatedStudent = await Student.findOneAndUpdate(
      { admissionNumber: admissionNo },
      updateData,
      { new: true, runValidators: true } // runValidators ensures new data meets schema rules
    );

    res.status(200).json({
      message: "Student promoted successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error promoting student:", error);
    res
      .status(500)
      .json({ message: "Error promoting student", error: error.message });
  }
};

// delete Student by id
const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Delete the student document
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // If the student had a parent, remove this student from the parent's students array
    if (student.parent) {
      await Parent.findByIdAndUpdate(student.parent, {
        $pull: { students: id },
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteStudentsBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate that 'ids' is provided and is an array
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid IDs array" });
    }

    // Find all students with the given IDs
    const students = await Student.find({ _id: { $in: ids } });
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found for the given IDs",
      });
    }

    // Delete all found student documents
    await Student.deleteMany({ _id: { $in: ids } });

    // Extract distinct parent IDs from the deleted students that have a parent reference
    const parentIds = [
      ...new Set(
        students
          .filter((student) => student.parent)
          .map((student) => student.parent.toString())
      ),
    ];

    // Update each parent document: remove all deleted student IDs from the parent's 'students' array
    await Promise.all(
      parentIds.map(async (parentId) => {
        await Parent.findByIdAndUpdate(parentId, {
          $pull: { students: { $in: ids } },
        });
      })
    );

    res
      .status(200)
      .json({ success: true, message: "Students deleted successfully" });
  } catch (error) {
    console.error("Error deleting students in bulk:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all deleted students
const getDeletedStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      class: classFilter,
      section,
    } = req.query;

    const filters = { isDeleted: true }; // Only students who are marked as deleted

    if (search) {
      filters.$or = [
        { firstName: new RegExp(search, "i") },
        { rollNo: new RegExp(search, "i") },
      ];
    }

    if (classFilter) filters.class = classFilter;
    if (section) filters.section = section;

    const students = await Student.find(filters, { studentCredentials: 0 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filters);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving deleted students", error });
  }
};

// get all blocked students
const getBlockedStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      class: classFilter,
      section,
    } = req.query;

    const filters = { isBlocked: true }; // Only students who are marked as blocked

    if (search) {
      filters.$or = [
        { firstName: new RegExp(search, "i") },
        { rollNo: new RegExp(search, "i") },
      ];
    }

    if (classFilter) filters.class = classFilter;
    if (section) filters.section = section;

    const students = await Student.find(filters, { studentCredentials: 0 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filters);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving blocked students", error });
  }
};

// GET /api/students/class/:classId/section/:sectionId
const getStudentsByClassAndSection = async (req, res) => {
  const { classId, sectionId } = req.params;

  // Validate IDs format if you like:
  // if (!mongoose.isValidObjectId(classId) || !mongoose.isValidObjectId(sectionId)) { … }

  try {
    const students = await Student.find(
      { class: classId, section: sectionId },
      '_id firstName lastName'
    );

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error('Error fetching students by class/section:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching students',
      error: error.message,
    });
  }
};

module.exports = {
  addStudent,
  updateStudent,
  getStudents,
  getDeletedStudents,
  getBlockedStudents,
  getStudentById,
  studentLogin,
  addStudentWithExistingParentData,
  exportStudentsToExcel,
  promoteStudent,
  addMultipleStudentsForParent,
  updateStudentStatus,
  deleteStudentById,
  deleteStudentsBulk,
  getCounts,
  getStudentsByClassAndSection,
};

{
  /* <button
  onClick={() => {
    const selectedStudentIds = ['id1', 'id2', 'id3']; // Replace with actual selected student IDs
    fetch('http://localhost:5000/api/students/export-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedStudentIds }),
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Failed to download');
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_data.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error(error));
  }}
>
  Download Selected Students
</button> */
}
