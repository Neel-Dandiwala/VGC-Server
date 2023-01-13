import { Request, Response } from 'express';
import { StudentInfo } from '../types/StudentInfo';
import Student from '../models/Student';
import { ResponseFormat } from "../resolvers/Format";
import argon2 from "argon2";
import {connection} from "../connection";
import {MongoServerError} from 'mongodb'
import * as nodemailer from 'nodemailer' 
require('dotenv').config()



const uploadImage = async(req:Request, res:Response) => {
    // console.log(req.file, req.body)
    res.status(200).json({ })
}

const uploadImageSecond = async(req:Request, res:Response) => {
    // console.log(req.file, req.body)
    res.status(200).json({ })
}

module.exports = {
    uploadImage, uploadImageSecond
}
