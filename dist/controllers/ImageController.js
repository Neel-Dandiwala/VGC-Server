"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const uploadImage = async (req, res) => {
    let logs = {
        field: "Image Uploaded",
        message: req.file
    };
    res.status(200).json({ logs });
};
module.exports = {
    uploadImage
};
//# sourceMappingURL=ImageController.js.map