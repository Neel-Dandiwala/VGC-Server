import express from 'express';
import { upload } from '../multer'

const { AdminPostController ,AdminGetEvents, uploadImage} = require('../controllers/AdminController')

const router = express.Router();

router.post('/admin/postevent', upload.single('file'), AdminPostController)
router.get('/admin/getevents', AdminGetEvents)
// router.post('/imagetrial', ImageTrial)

router.post('/uploadimage', upload.single('file'), uploadImage);

module.exports = router;