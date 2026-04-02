const mongoose = require("mongoose");

const examCategorySchema = new mongoose.Schema(
    {
        examCategoryName: { type: String, required: true },
        employeeName: { type: String, required: true },
        establishedDate: { type: Date, required: true },
        remark: { type: String } // Optional field
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExamCategory", examCategorySchema);
