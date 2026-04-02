const express = require('express');
const accountExpenseRouter = express.Router();
const { createAccountExpense, getAccountExpenses, getAccountExpenseById, getExpenseSummary, updateAccountExpense, deleteAccountExpense, generateInvoice, downloadInvoicePDF } = require('../controllers/accountExpenseController');

// Create Account Expense
accountExpenseRouter.post('/add-expense', createAccountExpense);

// Get all Account Expenses
accountExpenseRouter.get('/all-expense', getAccountExpenses);

//Get Account Expense by ID
accountExpenseRouter.get('/get-expense/:id', getAccountExpenseById);

//Update Account Expense by ID
accountExpenseRouter.put('/update-expense/:id', updateAccountExpense);

// Delete Account Expense by ID
accountExpenseRouter.delete('/delete-expense/:id', deleteAccountExpense);

//Generate Invoice for a specific Account Expense
accountExpenseRouter.put('/generate-invoice/:id', generateInvoice);

//Get Expense Summary
accountExpenseRouter.get('/expense-summary', getExpenseSummary);

//Download Invoice
accountExpenseRouter.get('/download-invoice/:id', downloadInvoicePDF);

module.exports = accountExpenseRouter;
