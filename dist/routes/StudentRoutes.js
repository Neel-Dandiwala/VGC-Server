"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { studentSignUp, studentLogIn, me, studentLogOut, studentChangePassword } = require('../controllers/StudentController');
const router = express_1.default.Router();
router.post('/student/signup', studentSignUp);
router.post('/student/login', studentLogIn);
router.get('/student/me', me);
router.get('/student/logout', studentLogOut);
router.post('/student/changepassword', studentChangePassword);
module.exports = router;
//# sourceMappingURL=StudentRoutes.js.map