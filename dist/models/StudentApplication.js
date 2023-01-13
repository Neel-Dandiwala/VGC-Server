"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentApplicationSchema = new mongoose_1.Schema({
    studentCollegeId: {
        type: String,
        required: true
    },
    studentApplicationName: {
        type: String,
        required: true
    },
    studentApplicationDescription: {
        type: String,
        required: true
    },
    studentApplicationDate: {
        type: String,
        required: true
    },
    studentApplicationOrganizer: {
        type: String,
        required: true
    },
    studentApplicationFile: {
        type: String,
        required: true
    },
    studentApplicationCategory: {
        type: String,
        required: true
    },
    studentApplicationStatus: {
        type: String,
        required: true
    },
    studentApplicationIssuedCoins: {
        type: Number,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("StudentApplication", StudentApplicationSchema);
//# sourceMappingURL=StudentApplication.js.map