"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `admin.${ext}`);
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "jpg") {
        cb(null, true);
    }
    else {
        cb(new Error("Not an image!"), false);
    }
};
exports.upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
//# sourceMappingURL=multer.js.map