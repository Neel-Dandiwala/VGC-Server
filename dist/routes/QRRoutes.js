"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { QRCodeGenerator } = require('../controllers/QRController');
const router = express_1.default.Router();
router.post('/qr/generate', QRCodeGenerator);
module.exports = router;
//# sourceMappingURL=QRRoutes.js.map