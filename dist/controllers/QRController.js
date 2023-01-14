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
function Base64ToImage(base64img, callback) {
    var img = new Image();
    img.onload = function () {
        callback(img);
    };
    img.src = base64img;
}
const QRCodeGenerator = async (req, res) => {
    const name = req.body.payeeName;
    const url = generateURL(name);
    const qrCode = await qrcode_1.default.toDataURL(url, {
        type: "image/png",
        margin: 1,
        width: 300,
    });
    console.log(qrCode);
    Base64ToImage(qrCode, function (img) {
    });
    res.status(200).json({});
};
module.exports = {
    QRCodeGenerator,
};
//# sourceMappingURL=QRController.js.map