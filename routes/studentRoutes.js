const express = require("express");
const {
  addStudent,
  updateStudent,
  getStudents,
  getDeletedStudents,
  getBlockedStudents,
  getStudentById,
  getCounts,
  addMultipleStudentsForParent,
  addStudentWithExistingParentData,
  deleteStudentsBulk,
  exportStudentsToExcel,
  updateStudentStatus,
  promoteStudent,
  deleteStudentById,
  studentLogin,
  getStudentsByClassAndSection,
} = require("../controllers/studentController");
const protect = require("../middlewares/protect");

const studentRouter = express.Router();
studentRouter.post("/student-login", studentLogin);
// All routes below will require a valid token
studentRouter.use(protect);

studentRouter.post("/add-student", addStudent);
studentRouter.post(
  "/add-student-with-parent",
  addStudentWithExistingParentData
);
studentRouter.post("/add-multiple-students", addMultipleStudentsForParent);
studentRouter.put("/update-student/:studentId", updateStudent);
studentRouter.get("/get-student/:studentId", getStudentById);
studentRouter.get("/all-students", getStudents);
studentRouter.get("/deleted-students", getDeletedStudents);
studentRouter.get("/blocked-students", getBlockedStudents);
studentRouter.post("/export-to-excel", exportStudentsToExcel);
studentRouter.put("/update-student-status/:studentId", updateStudentStatus);
studentRouter.put("/promote-student", promoteStudent);
studentRouter.delete("/delete-bulk-students", deleteStudentsBulk);
studentRouter.delete("/delete-student/:id", deleteStudentById);
studentRouter.delete("/delete-student/:id", deleteStudentById);
studentRouter.get("/get-counts", getCounts);
studentRouter.get("/class/:classId/section/:sectionId", getStudentsByClassAndSection);

module.exports = studentRouter;
