"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { committeeSignUp, committeeLogin } = require('../controllers/CommitteeController');
const router = express_1.default.Router();
router.post('/committee/signup', committeeSignUp);
router.post('/committee/login', committeeLogin);
module.exports = router;
//# sourceMappingURL=CommitteeRoutes.js.map