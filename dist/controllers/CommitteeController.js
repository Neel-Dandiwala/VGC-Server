"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Committee_1 = __importDefault(require("../models/Committee"));
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
const DateFormat_1 = require("../utils/DateFormat");
const imgur_1 = require("../imgur");
require('dotenv').config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const committeeSignUp = async (req, res) => {
    console.log(req.body);
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        let logs;
        const committeeName = req.body.committee_name;
        const committeeType = req.body.committee_type;
        const committeeEmail = req.body.committee_email;
        const committeePassword = req.body.password;
        const committeeBalance = req.body.committee_balance;
        console.log(committeeEmail);
        console.log(committeePassword);
        collection = db.collection('committee');
        let alreadyExisting = await collection.findOne({ committeeEmail: committeeEmail });
        console.log(alreadyExisting);
        if (alreadyExisting !== null) {
            logs = [
                {
                    field: "Committee SignUp Error",
                    message: "Committee already signed up before",
                }
            ];
            res.status(400).json({ logs });
            return { logs };
        }
        const _committee = new Committee_1.default({
            committeeName: committeeName,
            committeePassword: bcrypt.hashSync(committeePassword, 8),
            committeeType: committeeType,
            committeeEmail: committeeEmail,
            committeeBalance: committeeBalance,
        });
        let result;
        try {
            result = await collection.insertOne(_committee);
            console.log(_committee);
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = [{
                        field: "Unexpected Mongo Error",
                        message: "Default Message"
                    }];
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        console.log(result);
        if (result.acknowledged) {
            console.log(result);
            console.log("Committee Registered Successfull");
            res.status(200).json({ logs });
            return { logs };
        }
        else {
            logs = [
                {
                    field: "Unknown Error Occurred",
                    message: "Better check with administrator",
                }
            ];
            res.status(400).json({ logs });
            return { logs };
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const committeeLogin = async (req, res) => {
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        let logs;
        const committeeEmail = req.body.committee_email;
        const committeePassword = req.body.committee_password;
        collection = db.collection('committee');
        let alreadyExisting = await collection.findOne({ committeeEmail: committeeEmail });
        if (alreadyExisting == null) {
            logs = [
                {
                    field: "Committee Email Does not exists !",
                    message: "Please Register first to login !",
                }
            ];
            res.status(400).json({ logs });
            return { logs };
        }
        console.log(alreadyExisting);
        var passwordIsValid = bcrypt.compareSync(req.body.committee_password, alreadyExisting.committeePassword);
        if (!passwordIsValid) {
            return res.status(401)
                .json({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        req.session.authenticationID = alreadyExisting.committeeEmail;
        console.log(req.session.authenticationID);
        console.log("Sending status 200....");
        res.status(200)
            .json({
            committeeUser: {
                email: alreadyExisting.committeeEmail,
                name: alreadyExisting.committeeName,
                type: alreadyExisting.committeeType,
                balance: alreadyExisting.committeeBalance,
            },
            message: "Login successfull",
        });
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const setCommitteeEvent = async (req, res) => {
    console.log("Hi");
    let logs;
    console.log(req.body);
    console.log(req.session);
    const eventData = req.body;
    const _filename = req.file.filename;
    console.log(_filename);
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
        console.log(logs);
        res.status(400).json(logs);
        return;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    console.log(req.session.authenticationID);
    try {
        collection = db.collection('committeeEvent');
        let _committee_post;
        try {
            _committee_post = await collection.insertOne(eventData);
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
const getCommitteeEvents = async (req, res) => {
    console.log("Inside Committee GET controller");
    let allevents;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allevents = await db.collection('committeeEvent').find({}).toArray();
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
const committeeSetAdvertisement = async (req, res) => {
    let logs;
    const advertisementData = req.body;
    const _filename = req.file.filename;
    console.log(_filename);
    try {
        console.log("_link");
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        console.log("_link");
        console.log(_link);
        advertisementData.advertisementImageLink = _link;
        advertisementData.advertisementExpires = (0, DateFormat_1.formatDate)((0, DateFormat_1.addWeeksToDate)(new Date(), 2).toISOString());
        console.log(advertisementData);
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
const committeeSetSponsershipForm = async (req, res) => {
    let logs;
    const sponsershipData = req.body;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('sponsership');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(sponsershipData);
            logs = {
                field: "Sponsership form Posted on Database",
            };
            return res.status(200).json({ logs });
        }
        catch (e) {
            logs = {
                field: "Sponsership form Insertion Error",
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
    committeeSignUp, committeeLogin, setCommitteeEvent, getCommitteeEvents, committeeSetAdvertisement, committeeSetSponsershipForm
};
//# sourceMappingURL=CommitteeController.js.map