import express from 'express';
const { QRCodeGenerator } = require('../controllers/QRController')

const router = express.Router();

router.post('/qr/generate', QRCodeGenerator)


module.exports = router;