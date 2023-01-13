const express = require('express')
const imgur = require('imgur')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const imgurUploader = require('imgur-uploader');
import { ImgurClient } from 'imgur';

export const uploadOnImgur = async (filename: string) => {

    return await imgurUploader(fs.readFileSync('public/'+ filename)).then((data: any) => {
        console.log(data.link);
        return data.link;
    });
}
