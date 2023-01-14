"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = __importDefault(require("qrcode"));
require('dotenv').config();
const generateURL = (name) => {
    return `http://localhost:3000/student/${name}transfer`;
};
const QRCodeGenerator = async (req, res) => {
    const name = req.body.payeeName;
    const url = generateURL(name);
    const qrCode = await qrcode_1.default.toDataURL(url, {
        type: "image/png",
        margin: 1,
        width: 300,
    });
    console.log(qrCode);
    res.status(200).json({ qrCode });
};
module.exports = {
    QRCodeGenerator,
};
//# sourceMappingURL=QRController.js.map