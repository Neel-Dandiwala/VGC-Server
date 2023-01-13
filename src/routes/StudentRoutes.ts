import express from 'express';
import { uploadCertificate } from '../multer'
const { studentSignUp, studentLogIn, me, studentLogOut, studentChangePassword, studentGetBalance, studentGetApplications, studentSetApplication, studentGetEvents, studentGetAdvertisements, studentCanteenTransfer, studentStationeryTransfer } = require('../controllers/StudentController')

const router = express.Router();

router.post('/student/signup', studentSignUp)
router.post('/student/login', studentLogIn)
router.get('/student/me', me)
router.get('/student/logout', studentLogOut)
router.get('/student/balance', studentGetBalance)
router.post('/student/changepassword', studentChangePassword)
router.post('/student/setapplication',  uploadCertificate.single('file') ,studentSetApplication)
router.get('/student/getapplications', studentGetApplications)
router.get('/student/getevents', studentGetEvents)
router.get('/student/getadvertisements', studentGetAdvertisements)
router.post('/student/canteentransfer', studentCanteenTransfer)
router.post('/student/stationerytransfer', studentStationeryTransfer)


module.exports = router;