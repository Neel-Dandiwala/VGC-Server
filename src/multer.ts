import { Request } from 'express'
const multer = require("multer");

//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, "public");
    },
    filename: (req:any, file:any, cb:any) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `admin.${ext}`);
    },
});

// Multer Filter
const multerFilter = (req:any, file:any, cb:any) => {
    if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "jpg") {
        cb(null, true);
    } else {
        cb(new Error("Not an image!"), false);
    }
};

//Calling the "multer" Function
export const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

