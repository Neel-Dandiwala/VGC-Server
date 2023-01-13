"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../multer");
const { studentSignUp, studentLogIn, me, studentLogOut, studentChangePassword, studentGetBalance, studentGetApplications, studentSetApplication, studentGetEvents, studentGetAdvertisements, studentCanteenTransfer } = require('../controllers/StudentController');
const router = express_1.default.Router();
router.post('/student/signup', studentSignUp);
router.post('/student/login', studentLogIn);
router.get('/student/me', me);
router.get('/student/logout', studentLogOut);
router.get('/student/balance', studentGetBalance);
router.post('/student/changepassword', studentChangePassword);
router.post('/student/setapplication', multer_1.uploadCertificate.single('file'), studentSetApplication);
router.get('/student/getapplications', studentGetApplications);
router.get('/student/getevents', studentGetEvents);
router.get('/student/getadvertisements', studentGetAdvertisements);
router.post('/student/canteentransfer', studentCanteenTransfer);
module.exports = router;
//# sourceMappingURL=StudentRoutes.js.map