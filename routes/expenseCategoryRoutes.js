const express = require('express');
const expenseCategoryRouter = express.Router();
const { createExpenseCategory, getExpenseCategories, getExpenseCategoryById, updateExpenseCategory, deleteExpenseCategory } = require('../controllers/expenseCategoryController');

// Create Expense Category
expenseCategoryRouter.post('/add-expense-category', createExpenseCategory);

// Get all Expense Categories
expenseCategoryRouter.get('/all-expense-category', getExpenseCategories);

// Get Expense Category by ID
expenseCategoryRouter.get('/get-expense-category/:id', getExpenseCategoryById);

// Update Expense Category by ID
expenseCategoryRouter.put('/update-expense-category/:id', updateExpenseCategory);

// Delete Expense Category by ID
expenseCategoryRouter.delete('/delete-expense-category/:id', deleteExpenseCategory);

module.exports = expenseCategoryRouter;
