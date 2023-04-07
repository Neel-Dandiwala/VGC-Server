"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommitteeAdvertisementSchema = new mongoose_1.Schema({
    advertisementTitle: {
        type: String,
        required: true
    },
    advertisementDescription: {
        type: String,
        required: true
    },
    advertisementExpires: {
        type: String,
        required: true
    },
    advertisementImageLink: {
        type: String,
        required: true
    },
    advertisementAmount: {
        type: String,
        required: true
    },
    advertisementStatus: {
        type: String,
        required: true
    },
    advertisement_committee_email: {
        type: String,
        required: true
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("CommitteeAdvertisement", CommitteeAdvertisementSchema);
//# sourceMappingURL=CommitteeAdvertisement.js.map