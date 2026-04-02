const express = require("express");
const {
  addEmployee,
  getEmployeeById,
  updateEmployee,
  exportEmployeeToExcel,
  deleteEmployees,
  makeEmployeeSalary,
  updateEmployeeBlockStatus,
  getAllEmployees,
  getDeletedEmployees,
  getBlockedEmployees,
} = require("../controllers/employeeController");

const employeeRouter = express.Router();

// Add Employee
employeeRouter.post("/add-employee", addEmployee);

// Get Employee Details by Employee ID
employeeRouter.get("/single-employee/:employeeId", getEmployeeById);

// Update Employee Details
employeeRouter.put("/update-employee/:employeeId", updateEmployee);

// Download Employee Details by Employee ID(s) (Export to Excel)
employeeRouter.post("/export-employee", exportEmployeeToExcel);

// Delete Employee(s) (Bulk or Single)
employeeRouter.delete("/delete-employee", deleteEmployees);

// Make Employee Salary (update payment status)
employeeRouter.post("/make-employee-salary/:empId/:month", makeEmployeeSalary);

// Block Employee by ID
employeeRouter.put("/block-employee/:employeeId", updateEmployeeBlockStatus);

// Get All Employee Details with Search and Pagination
employeeRouter.get("/all-employee", getAllEmployees);
employeeRouter.get("/deleted-employee", getDeletedEmployees);
employeeRouter.get("/blocked-employee", getBlockedEmployees);

module.exports = employeeRouter;
