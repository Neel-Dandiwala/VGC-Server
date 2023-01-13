import { Request } from 'express'
const multer = require("multer");

//Configuration for Multer
const imageMulterStorage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, "public");
    },
    filename: (req:any, file:any, cb:any) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `temp.${ext}`);
    },
});

// Multer Filter
const imageMulterFilter = (req:any, file:any, cb:any) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "jpg") {
        cb(null, true);
    } else {
        cb(new Error("Not an image!"), false);
    }
};

//Calling the "multer" Function
export const uploadImage = multer({
    storage: imageMulterStorage,
    fileFilter: imageMulterFilter,
});

//Configuration for Multer
const certificateMulterStorage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, "public");
    },
    filename: (req:any, file:any, cb:any) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `temp.${ext}`);
    },
});

// Multer Filter
const certificateMulterFilter = (req:any, file:any, cb:any) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "pdf") {
        cb(null, true);
    } else {
        cb(new Error("Not a valid type!"), false);
    }
};

//Calling the "multer" Function
export const uploadCertificate = multer({
    storage: certificateMulterStorage,
    fileFilter: certificateMulterFilter,
});

