import express from 'express';
import { uploadImage } from '../multer'

const { AdminPostController ,AdminGetEvents, uploadImageTrial} = require('../controllers/AdminController')

const router = express.Router();

router.post('/admin/postevent', uploadImage.single('file'), AdminPostController)
router.get('/admin/getevents', AdminGetEvents)
// router.post('/imagetrial', ImageTrial)

router.post('/uploadimage', uploadImage.single('file'), uploadImageTrial);

module.exports = router;