const express = require("express");
const feeRouter = express.Router();

const {
    addFee, getAllFee, getFeeById, updateFee, deleteFee
} = require("../controllers/feeController.js");

feeRouter.post("/add-fee", addFee);
feeRouter.get("/all-fee", getAllFee);
feeRouter.get("/get-fee/:id", getFeeById);
feeRouter.put("/update-fee/:id", updateFee);
feeRouter.delete("/delete-fee/:id", deleteFee); 

module.exports = feeRouter;