"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommitteeSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: false
    },
    committeeName: {
        type: String,
        required: true
    },
    committeeType: {
        type: String,
        required: true
    },
    committeeEmail: {
        type: String,
        required: true
    },
    committeePassword: {
        type: String,
        required: true
    },
    committeeBalance: {
        type: Number,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Committee", CommitteeSchema);
//# sourceMappingURL=Committee.js.map