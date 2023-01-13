"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../multer");
const { adminSetEvent, adminGetEvent, uploadImageTrial, adminSetAdvertisement, adminGetStudentApplications, updateStudentApplication } = require('../controllers/AdminController');
const router = express_1.default.Router();
router.post('/admin/setevent', multer_1.uploadImage.single('file'), adminSetEvent);
router.get('/admin/getevents', adminGetEvent);
router.get('/admin/getstudentapplications', adminGetStudentApplications);
router.post('/admin/setadvertisement', multer_1.uploadImage.single('file'), adminSetAdvertisement);
router.post('/admin/updatestudentapplication', updateStudentApplication);
router.post('/uploadimage', multer_1.uploadImage.single('file'), uploadImageTrial);
module.exports = router;
//# sourceMappingURL=AdminRoutes.js.map