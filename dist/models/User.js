"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    studentRoll: {
        type: String,
        required: true
    },
    studentPassword: {
        type: String,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", StudentSchema);
//# sourceMappingURL=User.js.map