import express from 'express';
const { studentSignUp, studentLogIn, me, studentLogOut, studentChangePassword, studentGetBalance } = require('../controllers/StudentController')

const router = express.Router();

router.post('/student/signup', studentSignUp)
router.post('/student/login', studentLogIn)
router.get('/student/me', me)
router.get('/student/logout', studentLogOut)
router.get('/student/balance', studentGetBalance)
router.post('/student/changepassword', studentChangePassword)


module.exports = router;