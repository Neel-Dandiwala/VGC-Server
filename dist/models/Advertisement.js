"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AdvertisementSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Advertisement", AdvertisementSchema);
//# sourceMappingURL=Advertisement.js.map