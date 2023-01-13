"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
const imgur_1 = require("../imgur");
const DateFormat_1 = require("../utils/DateFormat");
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
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
const adminGetStudentApplications = async (req, res) => {
    console.log(req);
    let allStudentApplications;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allStudentApplications = await db.collection('student_application').find({}).toArray();
            res.status(200).json(allStudentApplications);
            console.log(allStudentApplications);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const updateStudentApplication = async (req, res) => {
    let logs;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        console.log(req.body);
        const studentApplicationId = req.body.id;
        const studentApplicationStatus = req.body.studentApplicationStatus;
        const studentApplicationIssuedCoins = req.body.studentApplicationIssuedCoins;
        collection = db.collection('student_application');
        let _student_application;
        try {
            _student_application = await collection.findOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) });
            console.log(_student_application);
            if (_student_application === null) {
                logs = {
                    field: "Student Application Not Found",
                    message: "Student Application Not Found ",
                };
                res.status(400).json({ logs });
                return { logs };
            }
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
                return;
            }
        }
        let result = await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: studentApplicationStatus, studentApplicationIssuedCoins: studentApplicationIssuedCoins } });
        if (result.acknowledged) {
            logs = {
                field: "Student Application Updated",
                message: studentApplicationId
            };
            let studentCollegeId = _student_application.studentApplicationCollegeId;
            collection = db.collection('student');
            let _student = await collection.updateOne({ _id: studentCollegeId }, { $inc: { studentBalance: parseInt(studentApplicationIssuedCoins) } });
            collection = db.collection('transaction');
            let _transaction = new Transaction_1.default({
                to: studentCollegeId,
                from: "admin",
                amount: parseInt(studentApplicationIssuedCoins),
                timestamp: (new Date()).toISOString()
            });
            let _transactionAdded = await collection.insertOne(_transaction);
            if (_student.acknowledged && _transactionAdded.acknowledged) {
                logs = {
                    field: "Successful Admin Transaction",
                    message: _transactionAdded.insertedId
                };
                collection = db.collection('global');
                await collection.updateOne({ _id: 'total_supply' }, { $inc: { value: parseInt(studentApplicationIssuedCoins) } });
                await collection.updateOne({ _id: 'total_in_circulation' }, { $inc: { value: parseInt(studentApplicationIssuedCoins) } });
                res.status(200).json(logs);
                return;
            }
            else if (_student.acknowledged && !_transactionAdded.acknowledged) {
                logs = {
                    field: "Failed Admin Transaction",
                    message: _student.insertedId
                };
                collection = db.collection('student');
                await collection.updateOne({ _id: studentCollegeId }, { $inc: { studentBalance: (-1 * parseInt(studentApplicationIssuedCoins)) } });
                collection = db.collection('student_application');
                await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: 'Pending', studentApplicationIssuedCoins: -1 } });
                res.status(400).json(logs);
                return;
            }
            else if (!_student.acknowledged && _transactionAdded.acknowledged) {
                logs = {
                    field: "Failed Admin Transaction",
                    message: _transactionAdded.insertedId
                };
                collection = db.collection('transaction');
                await collection.deleteOne({ _id: _transactionAdded.insertedId });
                collection = db.collection('student_application');
                await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: 'Pending', studentApplicationIssuedCoins: -1 } });
                res.status(400).json(logs);
                return;
            }
            else {
                logs = {
                    field: "Failed Admin Transaction",
                    message: result.insertedId
                };
                await collection.updateOne({ _id: new mongoose_1.default.Types.ObjectId(studentApplicationId) }, { $set: { studentApplicationStatus: 'Pending', studentApplicationIssuedCoins: -1 } });
                res.status(400).json(logs);
                return;
            }
        }
        else {
            logs = {
                field: "Student Updation Error",
                message: "Error while Updating Student Application"
            };
            res.status(400).json(logs);
        }
    }
    catch (e) {
        res.status(400).json({ message: e });
        throw e;
    }
};
const getStudents = async (req, res) => {
    let students;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            students = await db.collection('student').find({}).toArray();
            res.status(200).json({ students });
            console.log(students);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const getSupplyRedeemed = async (req, res) => {
    console.log(req);
    console.log("Inside Admin GetSupplyRedeemed ");
    let supply;
    let redeemed;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            supply = await db.collection('global').findOne({ _id: "total_supply" });
        }
        catch (e) {
            console.log(e);
        }
        try {
            redeemed = await db.collection('global').findOne({ _id: "total_redeemed" });
        }
        catch (e) {
            console.log(e);
        }
        res.status(200).json({ supply, redeemed });
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = {
    adminSetEvent, adminGetEvent, uploadImageTrial, adminSetAdvertisement, adminGetStudentApplications, updateStudentApplication, getStudents, getSupplyRedeemed
};
//# sourceMappingURL=AdminController.js.map