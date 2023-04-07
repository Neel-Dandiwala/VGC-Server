import express from 'express';
import { uploadCertificate ,uploadImage} from '../multer'
const { committeeSignUp ,committeeLogin ,setCommitteeEvent,getCommitteeEvents,committeeSetAdvertisement,committeeSetSponsershipForm} = require('../controllers/CommitteeController')

const router = express.Router();

router.post('/committee/signup', committeeSignUp)
router.post('/committee/login', committeeLogin)
router.post('/committee/setevent', uploadImage.single('file'), setCommitteeEvent)
router.get('/committee/getevents', getCommitteeEvents)
router.post('/committee/setadvertisement', uploadImage.single('file'), committeeSetAdvertisement)
router.post('/committee/setsponsershipform', committeeSetSponsershipForm)

// setsponsershipform


module.exports = router;