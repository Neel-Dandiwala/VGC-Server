"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCertificate = exports.uploadImage = void 0;
const multer = require("multer");
const imageMulterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `temp.${ext}`);
    },
});
const imageMulterFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "jpg") {
        cb(null, true);
    }
    else {
        cb(new Error("Not an image!"), false);
    }
};
exports.uploadImage = multer({
    storage: imageMulterStorage,
    fileFilter: imageMulterFilter,
});
const certificateMulterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `temp.${ext}`);
    },
});
const certificateMulterFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "pdf") {
        cb(null, true);
    }
    else {
        cb(new Error("Not a valid type!"), false);
    }
};
exports.uploadCertificate = multer({
    storage: certificateMulterStorage,
    fileFilter: certificateMulterFilter,
});
//# sourceMappingURL=multer.js.map