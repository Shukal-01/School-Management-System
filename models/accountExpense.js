const mongoose = require('mongoose');

const AccountExpenseSchema = new mongoose.Schema(
    {
        expensesCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExpenseCategory',
            required: [true, 'Expense Category is required'],
        },
        employeeName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Employee is required'],
        },
        expenseAmount: {
            type: Number,
            required: [true, 'Expense amount is required'],
        },
        allotedDate: {
            type: Date,
            required: [true, 'Alloted date is required'],
        },
        remarks: {
            type: String,
            default: '',
        },
        invoice: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('AccountExpense', AccountExpenseSchema);
