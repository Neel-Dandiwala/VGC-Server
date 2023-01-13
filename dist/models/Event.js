"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    committee: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: false
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Event", EventSchema);
//# sourceMappingURL=Event.js.map