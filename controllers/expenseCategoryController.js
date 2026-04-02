const ExpenseCategory = require('../models/expenseCategory');

// Create a new Expense Category
const createExpenseCategory = async (req, res) => {
    try {
        const { expenseName, status, remark } = req.body;
        const newExpenseCategory = new ExpenseCategory({
            expenseName,
            status,
            remark,
        });
        await newExpenseCategory.save();

        res.status(201).json({
            success: true,
            message: 'Expense Category added successfully',
            data: newExpenseCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Expense Categories with pagination, filtering, and searching
const getExpenseCategories = async (req, res) => {
    try {
        let { page = 1, limit = 10, expenseName, status } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let filter = {};

        if (expenseName) {
            filter.expenseName = { $regex: expenseName, $options: 'i' };
            // filter.expenseName = { $regex: search, $options: "i" };
        }
        if (status) {
            filter.status = status;
        }

        const total = await ExpenseCategory.countDocuments(filter);
        const categories = await ExpenseCategory.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "Expense Categories retrieved successfully",
            data: categories,
            
                total,
                pages: Math.ceil(total / limit),
                page: page,
                // pageSize: limit
            
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get an Expense Category by ID
const getExpenseCategoryById = async (req, res) => {
    try {
        const category = await ExpenseCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Expense Category not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Expense Category retrieved successfully',
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an Expense Category by ID
const updateExpenseCategory = async (req, res) => {
    try {
        const { expenseName, status, remark } = req.body;
        const updatedCategory = await ExpenseCategory.findByIdAndUpdate(
            req.params.id,
            { expenseName, status, remark },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Expense Category not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Expense Category updated successfully',
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an Expense Category by ID
const deleteExpenseCategory = async (req, res) => {
    try {
        const deletedCategory = await ExpenseCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Expense Category not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Expense Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createExpenseCategory,
    getExpenseCategories,
    getExpenseCategoryById,
    updateExpenseCategory,
    deleteExpenseCategory,
};
