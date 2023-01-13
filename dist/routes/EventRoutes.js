"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../multer");
const { uploadImage } = require('../controllers/EventController');
const router = express_1.default.Router();
router.post('/uploadimage', multer_1.upload.single('file'), uploadImage);
module.exports = router;
//# sourceMappingURL=EventRoutes.js.map