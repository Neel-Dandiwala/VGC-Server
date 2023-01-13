"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadOnImgur = void 0;
const express = require('express');
const imgur = require('imgur');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const imgurUploader = require('imgur-uploader');
const uploadOnImgur = async (filename) => {
    return await imgurUploader(fs.readFileSync('public/' + filename)).then((data) => {
        console.log(data.link);
        return data.link;
    });
};
exports.uploadOnImgur = uploadOnImgur;
//# sourceMappingURL=imgur.js.map