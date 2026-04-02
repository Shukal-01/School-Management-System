const express = require("express");
const adminRouter = express.Router();

const {
  createAdmin,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController.js");

adminRouter.post("/create-admin", createAdmin);
adminRouter.get("/all-user", getAllUsers);
adminRouter.get("/get-user/:id", getUserById);
adminRouter.put("/update-user/:id", updateUserRole);
adminRouter.delete("/delete-user/:id", deleteUser);

module.exports = adminRouter;
