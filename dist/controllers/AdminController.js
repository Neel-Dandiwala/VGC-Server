"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const imgur_1 = require("../imgur");
require('dotenv').config();
const uploadImageTrial = async (req, res) => {
    let logs = {
        field: "Image Uploaded",
        message: req.file
    };
    res.status(200).json({ logs });
};
const AdminPostController = async (req, res) => {
    let logs;
    console.log(req.body);
    const eventData = req.body;
    const _filename = req.file.filename;
    try {
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        eventData.file = _link;
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
        collection = db.collection('admin_posts');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(eventData);
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
const AdminGetEvents = async (req, res) => {
    console.log(req);
    console.log("Inside Admin GET controller");
    let allevents;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allevents = await db.collection('admin_posts').find({}).toArray();
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
module.exports = {
    AdminPostController, AdminGetEvents, uploadImageTrial
};
//# sourceMappingURL=AdminController.js.map