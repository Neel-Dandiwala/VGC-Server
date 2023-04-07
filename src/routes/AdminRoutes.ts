import express from 'express';
import { uploadImage } from '../multer'

const { adminSetEvent ,adminGetEvent, uploadImageTrial, adminSetAdvertisement, adminGetStudentApplications, updateStudentApplication, getStudents, getSupplyRedeemed, flushCanteen, flushStationery, getRewarderBalance ,adminGetAdvertisements,updateAdminAdvertisement,updateAdminEvent,adminGetSponserships,updateAdminSponsershipStatus} = require('../controllers/AdminController')

const router = express.Router();

router.post('/admin/setevent', uploadImage.single('file'), adminSetEvent)
router.get('/admin/getevents', adminGetEvent)
router.get('/admin/getstudentapplications', adminGetStudentApplications)
router.post('/admin/setadvertisement', uploadImage.single('file'), adminSetAdvertisement)
router.get('/admin/getadvertisements',  adminGetAdvertisements)
router.post('/admin/updateadvertisement',  updateAdminAdvertisement)
router.post('/admin/updateevent',  updateAdminEvent)
router.get('/admin/getsponserships',  adminGetSponserships)
router.post('/admin/updatesponsership',  updateAdminSponsershipStatus)



router.post('/admin/updatestudentapplication', updateStudentApplication)
router.get('/admin/getstudents', getStudents)
router.get('/admin/getsupplyredeemed', getSupplyRedeemed)
router.get('/admin/flushcanteen', flushCanteen)
router.get('/admin/flushstationery', flushStationery)
router.get('/admin/getrewarderbalance', getRewarderBalance)

router.post('/uploadimage', uploadImage.single('file'), uploadImageTrial);

module.exports = router;