"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../multer");
const { committeeSignUp, committeeLogin, setCommitteeEvent, getCommitteeEvents, committeeSetAdvertisement, committeeSetSponsershipForm } = require('../controllers/CommitteeController');
const router = express_1.default.Router();
router.post('/committee/signup', committeeSignUp);
router.post('/committee/login', committeeLogin);
router.post('/committee/setevent', multer_1.uploadImage.single('file'), setCommitteeEvent);
router.get('/committee/getevents', getCommitteeEvents);
router.post('/committee/setadvertisement', multer_1.uploadImage.single('file'), committeeSetAdvertisement);
router.post('/committee/setsponsershipform', committeeSetSponsershipForm);
module.exports = router;
//# sourceMappingURL=CommitteeRoutes.js.map