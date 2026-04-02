const Employee = require("../models/employee.js");
const ExcelJS = require("exceljs");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user.js");

// 1. Add Employee
const addEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const newEmployee = await Employee.create(employeeData);
    // Generate unique IDs and passwords for the student (and new parent if required)
    const employeeId = `${employeeData.firstName}-${Date.now()}`;
    const employeePassword = `${employeeData.firstName}@${Math.random()
      .toString(16)
      .slice(-6)}`;

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
      Dear ${employeeData.firstName},

      You are ${employeeData.firstName} has been successfully registered.

      Employeee Login Details:
      ID: ${employeeId}
      Password: ${employeePassword}
    `;

    emailText += `
      Regards,
      School Management
    `;

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: employeeData.email,
      subject: "Welcome to Our School",
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    const user = new User({
      name: `${employeeData.firstName} ${employeeData.lastName}`,
      email: employeeData.email,
      userName: employeeId,
      password: employeePassword,
      phone: employeeData.phone,
      role: "employee",
    });

    await user.save();

    res.status(201).json({
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      // Extract the field that caused the duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        message: `Duplicate value entered for ${field}. Please use a different value.`,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
};

// 2. Get Employee Details by ID (with subject populated)
const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId)
      return res.status(400).json({ message: "Employee ID is required" });

    // Populate the subject field to include subject data
    const employee = await Employee.findById(employeeId).populate("subject");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({
      message: "Employee fetched successfully",
      employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 3. Edit Employee Details
const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true, runValidators: true }
    ).populate("subject"); // Populate updated subject data if any

    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 4. Download Employee Details by Employee ID(s) (Export to Excel)
const exportEmployeeToExcel = async (req, res) => {
  try {
    const { ids } = req.body; // expect an array of employee IDs
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid IDs array" });
    }

    // Populate subject data while fetching employee details
    const employees = await Employee.find({ _id: { $in: ids } }).populate(
      "subject"
    );
    if (!employees.length) {
      return res
        .status(404)
        .json({ message: "No employees found for the given IDs" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Data");

    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 50 },
    ];

    employees.forEach((employee, index) => {
      worksheet.addRow({ field: `Employee ${index + 1}`, value: "" });
      Object.entries(employee.toObject()).forEach(([key, value]) => {
        worksheet.addRow({
          field: key,
          value:
            typeof value === "object" && value !== null
              ? JSON.stringify(value, null, 2)
              : value,
        });
      });
      worksheet.addRow({}); // Blank row for separation
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employees_data.xlsx"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting employees to Excel:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 5. Delete Employee By ID(s) (Bulk or Single)
const deleteEmployees = async (req, res) => {
  try {
    const { ids } = req.body; // expect an array of employee IDs
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid IDs array" });
    }

    const result = await Employee.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No employees found to delete" });
    }
    res.status(200).json({
      message: `${result.deletedCount} employee(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting employees:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 6. Make Employee Salary (Update Payment Status)
const makeEmployeeSalary = async (req, res) => {
  try {
    const { empId, month } = req.params; // empId and month (numeric) are passed in the URL
    const paymentData = req.body; // payment details from request body

    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Add payment data to the employee's amount array
    employee.amount.push(paymentData);

    // Check if a salary record for the specified month exists; if so, mark it as "Paid"
    const recordIndex = employee.salaryRecords.findIndex(
      (record) => record.month === parseInt(month)
    );
    if (recordIndex !== -1) {
      employee.salaryRecords[recordIndex].status = "Paid";
    }

    await employee.save();
    res.status(200).json({ message: "Salary record updated successfully" });
  } catch (error) {
    console.error("Error making employee salary:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 7. Block Employee by ID
const updateEmployeeBlockStatus = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { action } = req.body; // Expected values: "block", "unblock", "delete", or "revert"

    // Validate action
    if (!["block", "unblock", "delete", "revert"].includes(action)) {
      return res.status(400).json({
        message:
          "Invalid action. Use 'block', 'unblock', 'delete', or 'revert'.",
      });
    }

    // Determine the update based on action
    let update = {};
    if (action === "block") {
      update.blockId = true;
    } else if (action === "unblock") {
      update.blockId = false;
    } else if (action === "delete") {
      update.delete = true;
    } else if (action === "revert") {
      update.delete = false;
    }

    // Find and update the employee document
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      update,
      { new: true } // Returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: `Employee ${action}ed successfully`,
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 8. Get All Employee Details with Search and Pagination (with subject populated)
const getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      name = "",
      employeeId,
      department,
    } = req.query;

    const query = {
      delete: { $ne: true }, // Exclude employee with isDeleted: true
      blockId: { $ne: true }, // Exclude employee with isBlocked: true
    };

    // Search by firstName, lastName, officialDetails.employeeId or officialDetails.department
    if (name) {
      query.$or = [{ firstName: { $regex: name, $options: "i" } }];
    }

    // If `employeeId` is provided, filter by employeeId under officialDetails
    if (employeeId) query["officialDetails.employeeId"] = employeeId;

    // If `department` is provided, filter by department under officialDetails
    if (department) query["officialDetails.department"] = department;

    // Populate the subject field in the returned documents
    const employees = await Employee.find(query)
      .populate("subject")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalEmployees = await Employee.countDocuments(query);

    res.status(200).json({
      message: "Employees fetched successfully",
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getBlockedEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, employeeId, department } = req.query;
    const query = { blockId: true }; // Filter employees who are blocked

    if (name) {
      query.$or = [{ firstName: { $regex: name, $options: "i" } }];
    }

    // If `employeeId` is provided, filter by employeeId under officialDetails
    if (employeeId) query["officialDetails.employeeId"] = employeeId;

    // If `department` is provided, filter by department under officialDetails
    if (department) query["officialDetails.department"] = department;

    // Fetch the blocked employees with pagination
    const blockedEmployees = await Employee.find(query)
      .populate("subject")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Calculate the total number of blocked employees
    const totalBlockedEmployees = await Employee.countDocuments(query);

    res.status(200).json({
      message: "Blocked employees fetched successfully",
      employees: blockedEmployees,
      totalPages: Math.ceil(totalBlockedEmployees / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching blocked employees:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getDeletedEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      name = "",
      employeeId,
      department,
    } = req.query;
    const query = { delete: true }; // Filter employees who are deleted

    if (name) {
      query.$or = [{ firstName: { $regex: name, $options: "i" } }];
    }

    // If `employeeId` is provided, filter by employeeId under officialDetails
    if (employeeId) query["officialDetails.employeeId"] = employeeId;

    // If `department` is provided, filter by department under officialDetails
    if (department) query["officialDetails.department"] = department;

    // Fetch the deleted employees with pagination
    const deletedEmployees = await Employee.find(query)
      .populate("subject")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Calculate the total number of deleted employees
    const totalDeletedEmployees = await Employee.countDocuments(query);

    res.status(200).json({
      message: "Deleted employees fetched successfully",
      employees: deletedEmployees,
      totalPages: Math.ceil(totalDeletedEmployees / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching deleted employees:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addEmployee,
  getEmployeeById,
  updateEmployee,
  exportEmployeeToExcel,  
  deleteEmployees,
  makeEmployeeSalary,
  updateEmployeeBlockStatus,
  getAllEmployees,
  getBlockedEmployees,
  getDeletedEmployees,
};
