"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: false
    },
    studentCollegeId: {
        type: String,
        required: true
    },
    studentPassword: {
        type: String,
        required: true
    },
    studentBalance: {
        type: Number,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Student", StudentSchema);
//# sourceMappingURL=Student.js.map