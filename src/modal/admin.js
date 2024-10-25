const mongoose = require('mongoose');

const officialLeaveSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OfficialLeave = mongoose.model('OfficialLeave', officialLeaveSchema);

module.exports = OfficialLeave;
