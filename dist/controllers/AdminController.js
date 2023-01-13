"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const imgur_1 = require("../imgur");
const DateFormat_1 = require("../utils/DateFormat");
require('dotenv').config();
const uploadImageTrial = async (req, res) => {
    let logs = {
        field: "Image Uploaded",
        message: req.file
    };
    res.status(200).json({ logs });
};
const adminSetEvent = async (req, res) => {
    let logs;
    console.log(req.body);
    const eventData = req.body;
    const _filename = req.file.filename;
    try {
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        eventData.eventFile = _link;
        eventData.eventDate = (0, DateFormat_1.formatDate)((new Date()).toISOString());
    }
    catch (err) {
        logs = {
            field: "Imgur Error",
            message: "Better check with administrator"
        };
        res.status(400).json(logs);
        return;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('event');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(eventData);
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
            };
            return res.status(200).json({ logs });
        }
        catch (e) {
            logs = {
                field: "Insertion Error",
                message: e
            };
            return res.status(400).json({ logs });
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const adminGetEvent = async (req, res) => {
    console.log(req);
    console.log("Inside Admin GET controller");
    let allevents;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allevents = await db.collection('event').find({}).toArray();
            res.status(200).json({ allevents });
            console.log(allevents);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const adminSetAdvertisement = async (req, res) => {
    let logs;
    console.log(req.body);
    const advertisementData = req.body;
    const _filename = req.file.filename;
    try {
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        advertisementData.advertisementImageLink = _link;
        advertisementData.advertisementExpires = (0, DateFormat_1.formatDate)((0, DateFormat_1.addWeeksToDate)(new Date(), 2).toISOString());
    }
    catch (err) {
        logs = {
            field: "Imgur Error",
            message: "Better check with administrator"
        };
        res.status(400).json(logs);
        return;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('advertisement');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(advertisementData);
            logs = {
                field: "Advertisement Posted on Database",
                advertisementName: advertisementData.advertisementName,
                advertisementDescription: advertisementData.advertisementDescription,
                advertisementExpires: advertisementData.advertisementExpires,
                advertisementImageLink: advertisementData.advertisementImageLink,
            };
            return res.status(200).json({ logs });
        }
        catch (e) {
            logs = {
                field: "Advertisement Insertion Error",
                message: e
            };
            return res.status(400).json({ logs });
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
module.exports = {
    adminSetEvent, adminGetEvent, uploadImageTrial, adminSetAdvertisement
};
//# sourceMappingURL=AdminController.js.map