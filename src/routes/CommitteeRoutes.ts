import express from 'express';
import { uploadCertificate } from '../multer'
const { committeeSignUp ,committeeLogin } = require('../controllers/CommitteeController')

const router = express.Router();

router.post('/committee/signup', committeeSignUp)
router.post('/committee/login', committeeLogin)



module.exports = router;