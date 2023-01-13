import express from 'express';
import { uploadImage } from '../multer'

const { adminSetEvent ,adminGetEvent, uploadImageTrial, adminSetAdvertisement} = require('../controllers/AdminController')

const router = express.Router();

router.post('/admin/setevent', uploadImage.single('file'), adminSetEvent)
router.get('/admin/getevents', adminGetEvent)
router.post('/admin/setadvertisement', uploadImage.single('file'), adminSetAdvertisement)
// router.post('/imagetrial', ImageTrial)

router.post('/uploadimage', uploadImage.single('file'), uploadImageTrial);

module.exports = router;