import express from 'express';
import { upload } from '../multer'
const { uploadImage, uploadImageSecond }  = require('../controllers/ImageController' )

const router = express.Router();


router.post('/testimage', upload.single('file'), uploadImage);

    
module.exports = router;