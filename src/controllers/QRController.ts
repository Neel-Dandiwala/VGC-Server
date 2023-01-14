import QRCode from "qrcode"
import { Request, Response } from 'express';
import { StudentInfo } from '../types/StudentInfo';
import Student from '../models/Student';
import { ResponseFormat } from "../resolvers/Format";
import argon2 from "argon2";
import {connection} from "../connection";
import {MongoServerError} from 'mongodb'
import * as nodemailer from 'nodemailer' 
require('dotenv').config()

const generateURL = (name: string) => {
    return `http://localhost:3000/student/${name}transfer`;
};

const QRCodeGenerator = async (req:Request, res:Response) => {
    //TODO: Add validation
    const name = req.body.payeeName;
    const url = generateURL(name);
    const qrCode = await QRCode.toDataURL(url, {
      type: "image/png",
      margin: 1,
      width: 300,
    });
    console.log(qrCode)
    
    // res.setHeader("content-type", "image/png");
    res.status(200).json({qrCode});
  }

module.exports = {
    QRCodeGenerator,
}