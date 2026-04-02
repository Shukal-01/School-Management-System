const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    startTime:{ type: String, required: true },
    endTime:{ type: String, required: true },
    description:{ type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('TimeTable', timeTableSchema);