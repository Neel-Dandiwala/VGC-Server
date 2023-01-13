import { Request, Response } from 'express';
import { EventInfo } from '../types/EventInfo';
import { AdvertisementInfo } from '../types/AdvertisementInfo';
// import { ResponseFormat } from "../resolvers/Format";
// import argon2 from "argon2";
import { connection } from "../connection";
import { MongoServerError } from 'mongodb'
import { uploadOnImgur } from '../imgur';
import { formatDate, addWeeksToDate } from '../utils/DateFormat' 
require('dotenv').config()


const uploadImageTrial = async(req:Request, res:Response) => {
    // console.log(req.file, req.body)
    let logs = {
        field: "Image Uploaded",
        message: req.file
    }
    res.status(200).json({ logs})
}


const adminSetEvent = async (req: Request, res: Response) => {
    let logs;
    console.log(req.body)
    const eventData = req.body  as Pick<EventInfo, "eventName" | "eventDescription" | "eventVenue" | "eventDate" | "eventStartTime" | "eventEndTime" | "eventCommittee" | "eventContact" | "eventFile">
    const _filename = req.file.filename
    try {
        let _link = await uploadOnImgur(_filename)
        eventData.eventFile = _link
        eventData.eventDate = formatDate((new Date()).toISOString())
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
        collection = db.collection('event');

        let _admin_post;
        try {
            _admin_post = await collection.insertOne(eventData);
            // console.log(_admin_post)
            logs = {
                field: "Event Posted",
                eventName: eventData.eventName,
                eventDescription: eventData.eventDescription,
                eventVenue: eventData.eventVenue,
                eventDate: eventData.eventDate,
                eventStartTime: eventData.eventStartTime,
                eventEndTime: eventData.eventEndTime,
                eventCommittee: eventData.eventCommittee,
                eventContact: eventData.eventContact,
                eventFile: eventData.eventFile,
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

const adminGetEvent = async (req: Request, res: Response) => {

    console.log(req)
    console.log("Inside Admin GET controller")
    // console.log(req)
    let allevents;
    try {
        const db = await connection.getDb();
        console.log(db)

        try {
            allevents = await db.collection('event').find({}).toArray();
            res.status(200).json({ allevents })
            console.log(allevents)
        } catch (e) {
            console.log(e)
        }

    } catch (e) {
        console.log(e)
    }

}

const adminSetAdvertisement = async(req: Request, res:Response) => {
    let logs;
    console.log(req.body)
    const advertisementData = req.body  as Pick<AdvertisementInfo, "advertisementName" | "advertisementDescription" | "advertisementExpires" | "advertisementImageLink">
    const _filename = req.file.filename
    try {
        let _link = await uploadOnImgur(_filename)
        advertisementData.advertisementImageLink = _link
        advertisementData.advertisementExpires =  formatDate(addWeeksToDate(new Date(), 2).toISOString())
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
        collection = db.collection('advertisement');

        let _admin_post;
        try {
            _admin_post = await collection.insertOne(advertisementData);
            // console.log(_admin_post)
            logs = {
                field: "Advertisement Posted on Database",
                advertisementName: advertisementData.advertisementName,
                advertisementDescription: advertisementData.advertisementDescription,
                advertisementExpires: advertisementData.advertisementExpires,
                advertisementImageLink: advertisementData.advertisementImageLink,
            }
            return res.status(200).json({ logs })

        } catch (e) {
            logs = {
                field: "Advertisement Insertion Error",
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
    adminSetEvent, adminGetEvent, uploadImageTrial, adminSetAdvertisement
}