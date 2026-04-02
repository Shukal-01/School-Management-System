const AccountExpense = require('../models/accountExpense.js');
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Create a new Account Expense
const createAccountExpense = async (req, res) => {
    try {
        const { expensesCategory, employeeName, expenseAmount, allotedDate, remarks, invoice } = req.body;
        const newExpense = new AccountExpense({
            expensesCategory,
            employeeName,
            expenseAmount,
            allotedDate,
            remarks,
            invoice,
        });
        await newExpense.save();

        res.status(201).json({
            success: true,
            message: 'Account expense created successfully',
            data: newExpense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Account Expenses with pagination, filtering, and searching
const getAccountExpenses = async (req, res) => {
    try {
        let { page = 1, limit = 10, search, expensesCategory, employeeName } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let filter = {};

        if (search) {
            filter.$or = [
                { remarks: { $regex: search, $options: "i" } },
                { invoice: { $regex: search, $options: "i" } }
            ];
        }

        let expenses = await AccountExpense.find(filter)
            .populate("employeeName")
            .populate("expensesCategory")
            .skip((page - 1) * limit)
            .limit(limit);

        if (employeeName) {
            expenses = expenses.filter((exp) =>
                `${exp.employeeName.firstName} ${exp.employeeName.lastName}`.toLowerCase().includes(employeeName.toLowerCase())
            );
        }
        
        if (expensesCategory) {
            expenses = expenses.filter((exp) =>
                exp.expensesCategory.expenseName.toLowerCase().includes(expensesCategory.toLowerCase())
            );
        }

        const total = await AccountExpense.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Account expenses retrieved successfully",
            data: expenses,
            
                total,
                pages: Math.ceil(total / limit),
                page: page,
                // pages: limit
            
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single Account Expense by ID
const getAccountExpenseById = async (req, res) => {
    try {
        const expense = await AccountExpense.findById(req.params.id)
            .populate('employeeName')
            .populate('expensesCategory');
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Account expense not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Account expense retrieved successfully',
            data: expense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an Account Expense by ID
const updateAccountExpense = async (req, res) => {
    try {
        const { expensesCategory, employeeName, expenseAmount, allotedDate, remarks, invoice } = req.body;
        const updatedExpense = await AccountExpense.findByIdAndUpdate(
            req.params.id,
            { expensesCategory, employeeName, expenseAmount, allotedDate, remarks, invoice },
            { new: true, runValidators: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: 'Account expense not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Account expense updated successfully',
            data: updatedExpense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an Account Expense by ID
const deleteAccountExpense = async (req, res) => {
    try {
        const deletedExpense = await AccountExpense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({
                success: false,
                message: 'Account expense not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Account expense deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate Invoice for a specific Account Expense
const generateInvoice = async (req, res) => {
    try {
        const expense = await AccountExpense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Account expense not found',
            });
        }
        // Generate invoice string. For example: "INV-2025-abcde"
        const year = new Date(expense.allotedDate).getFullYear();
        const shortId = expense._id.toString().slice(-5).toUpperCase();
        const invoiceCode = `INV-${year}-${shortId}`;

        expense.invoice = invoiceCode;
        await expense.save();

        res.status(200).json({
            success: true,
            message: 'Invoice generated successfully',
            data: { invoice: invoiceCode },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Download Invoice as PDF
const downloadInvoicePDF = async (req, res) => {
    try {
        const expense = await AccountExpense.findById(req.params.id)
            .populate("employeeName")
            .populate("expensesCategory");

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        const doc = new PDFDocument();
        const filename = `Invoice_${expense.invoice}.pdf`;

        // Pipe PDF to response
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        // Example invoice content
        doc.fontSize(20).text("Invoice", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Invoice No: ${expense.invoice}`);
        doc.text(`Employee: ${expense.employeeName.firstName} ${expense.employeeName.lastName}`);
        doc.text(`Category: ${expense.expensesCategory.expenseName}`);
        doc.text(`Amount: ₹${expense.expenseAmount}`);
        doc.text(`Date: ${new Date(expense.allotedDate).toLocaleDateString()}`);
        doc.text(`Remarks: ${expense.remarks}`);
        
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Expense Summary (by month, quarter, and 6 months)
const getExpenseSummary = async (req, res) => {
    try {
        // Monthly aggregation: group by year, month and category
        const monthlyAggregation = await AccountExpense.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$allotedDate" },
                        month: { $month: "$allotedDate" },
                        expensesCategory: "$expensesCategory"
                    },
                    totalExpense: { $sum: "$expenseAmount" }
                }
            },
            {
                $lookup: {
                    from: "expensecategories", // collection name for ExpenseCategory (lowercase plural)
                    localField: "_id.expensesCategory",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    expensesCategory: "$category.expenseName",
                    totalExpense: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, month: 1, expensesCategory: 1 } }
        ]);

        // Quarterly aggregation: group by year, quarter and category
        const quarterlyAggregation = await AccountExpense.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$allotedDate" },
                        quarter: { $ceil: { $divide: [{ $month: "$allotedDate" }, 3] } },
                        expensesCategory: "$expensesCategory"
                    },
                    totalExpense: { $sum: "$expenseAmount" }
                }
            },
            {
                $lookup: {
                    from: "expensecategories",
                    localField: "_id.expensesCategory",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    year: "$_id.year",
                    quarter: "$_id.quarter",
                    expensesCategory: "$category.expenseName",
                    totalExpense: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, quarter: 1, expensesCategory: 1 } }
        ]);

        // Semi-annual aggregation: group by year, half-year and category
        const semiAnnualAggregation = await AccountExpense.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$allotedDate" },
                        half: {
                            $cond: [
                                { $lte: [{ $month: "$allotedDate" }, 6] },
                                1,
                                2
                            ]
                        },
                        expensesCategory: "$expensesCategory"
                    },
                    totalExpense: { $sum: "$expenseAmount" }
                }
            },
            {
                $lookup: {
                    from: "expensecategories",
                    localField: "_id.expensesCategory",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    year: "$_id.year",
                    half: "$_id.half",
                    expensesCategory: "$category.expenseName",
                    totalExpense: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, half: 1, expensesCategory: 1 } }
        ]);

        res.status(200).json({
            success: true,
            message: "Expense summary retrieved successfully",
            data: {
                monthly: monthlyAggregation,
                quarterly: quarterlyAggregation,
                semiAnnual: semiAnnualAggregation
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAccountExpense,
    getAccountExpenses,
    getAccountExpenseById,
    updateAccountExpense,
    deleteAccountExpense,
    generateInvoice,
    getExpenseSummary,
    downloadInvoicePDF,
};
