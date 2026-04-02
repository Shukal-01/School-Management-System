const mongoose = require('mongoose');

const ExpenseCategorySchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: [true, 'Expense name is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    remark: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseCategory', ExpenseCategorySchema);
