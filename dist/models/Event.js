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
    eventVenue: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true
    },
    eventStartTime: {
        type: String,
        required: true
    },
    eventEndTime: {
        type: String,
        required: true
    },
    eventCommittee: {
        type: String,
        required: true
    },
    eventContact: {
        type: String,
        required: true
    },
    eventFile: {
        type: String,
        required: false
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Event", EventSchema);
//# sourceMappingURL=Event.js.map