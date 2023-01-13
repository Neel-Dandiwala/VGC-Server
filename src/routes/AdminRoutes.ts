import express from 'express';
const { AdminPostController ,AdminGetEvents, ImageTrial} = require('../controllers/AdminController')

const router = express.Router();

router.post('/admin/postevent', AdminPostController)
router.get('/admin/getevents', AdminGetEvents)
router.post('/imagetrial', ImageTrial)



module.exports = router;