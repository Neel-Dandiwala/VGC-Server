import { Request, Response } from 'express';
import { AdvertisementInfo } from '../types/AdvertisementInfo';
import AdminPost from '../models/AdminPost';
// import { ResponseFormat } from "../resolvers/Format";
// import argon2 from "argon2";
import { connection } from "../connection";
import { MongoServerError } from 'mongodb'
import { all } from 'axios';
import { uploadOnImgur } from '../imgur';
// import * as nodemailer from 'nodemailer'
require('dotenv').config()

const setAdvertisement = async(req: Request, res:Response) => {
    let logs;
    console.log(req.body)
    const advertisementData = req.body  as Pick<AdvertisementInfo, "advertisementTitle" | "advertisementDescription" | "advertisementExpires" | "advertisementImageLink">
    const _filename = req.file.filename
    try {
        let _link = await uploadOnImgur(_filename)
        advertisementData.advertisementImageLink = _link
    } catch(err) {
        logs = {
            field: "Imgur Error",
            message: "Better check with administrator"
        }
        res.status(400).json(logs)
        return
    }

    const db = await connection.getDb();
    let collection;

    try {
        collection = db.collection('admin_posts');

        let _admin_post;
        try {
            _admin_post = await collection.insertOne(eventData);
            // console.log(_admin_post)
            logs = {
                field: "Event Posted",
                eventName: eventData.eventName,
                eventDescription: eventData.eventDescription,
                venue: eventData.venue,
                date: eventData.date,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                committee: eventData.committee,
                contact: eventData.contact,
                file: eventData.file,
            }
            return res.status(200).json({ logs })

        } catch (e) {
            logs = {
                field: "Insertion Error",
                message: e
            }
            return res.status(400).json({ logs })
        }


    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }
}

module.exports = {

}