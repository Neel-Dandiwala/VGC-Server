"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Student_1 = __importDefault(require("../models/Student"));
const argon2_1 = __importDefault(require("argon2"));
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
const imgur_1 = require("../imgur");
const nodemailer = __importStar(require("nodemailer"));
const StudentApplication_1 = __importDefault(require("../models/StudentApplication"));
require('dotenv').config();
const studentSignUp = async (req, res) => {
    console.log(req);
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        let logs;
        const studentId = req.body.studentId;
        console.log(studentId);
        collection = db.collection('it_cs_students');
        let studentExist = await collection.findOne({ _id: studentId });
        if (studentExist === null) {
            logs = [
                {
                    field: "Non-existing Student Error",
                    message: "Student does not exist",
                }
            ];
            res.status(400).json({ logs });
            return { logs };
        }
        collection = db.collection('student');
        let alreadyExisting = await collection.findOne({ _id: studentId });
        if (alreadyExisting !== null) {
            logs = [
                {
                    field: "Student SignUp Error",
                    message: "Student already signed up before",
                }
            ];
            res.status(400).json({ logs });
            return { logs };
        }
        let randomPassword = Math.random().toString(36).substring(2, 8);
        const _student = new Student_1.default({
            _id: studentId,
            studentCollegeId: studentId,
            studentPassword: randomPassword,
            studentBalance: -1
        });
        let result;
        try {
            result = await collection.insertOne(_student);
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
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'vgcoins321@gmail.com',
                    pass: 'rtbdibujphwjsslf',
                },
            });
            var mailOptions = {
                from: "vgcoins321@gmail.com",
                to: studentExist.studentMailId,
                subject: "Hello from VGC",
                text: "Your password is " + randomPassword,
                headers: { 'x-myheader': 'test header' }
            };
            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    logs = [
                        {
                            field: "NodeMailer Error",
                            message: error,
                        }
                    ];
                    res.status(400).json({ logs });
                    return { logs };
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
            logs = [
                {
                    field: "Successful Insertion",
                    message: "Done",
                }
            ];
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
const studentLogIn = async (req, res) => {
    console.log(req);
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        let logs;
        const studentId = req.body.studentId;
        const studentPassword = req.body.studentPassword;
        collection = db.collection('student');
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs = [
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    }
                ];
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
                throw new Error(err);
            }
        }
        if (_student.studentPassword.startsWith("$argon")) {
            const valid = await argon2_1.default.verify(_student.studentPassword, studentPassword);
            if (valid) {
                collection = db.collection('it_cs_students');
                let _studentDetails = await collection.findOne({ _id: studentId });
                req.session.authenticationID = (_student._id).toString();
                logs =
                    {
                        field: "Normal Login",
                        _id: _studentDetails._id,
                        studentName: _studentDetails.studentName,
                        studentMailId: _studentDetails.studentMailId,
                        studentCollegeId: _studentDetails.studentCollegeId,
                        studentContactNumber: _studentDetails.studentContactNumber,
                        studentBalance: _student.studentBalance
                    };
                res.status(200).json(logs);
                return { logs };
            }
            else {
                logs = [
                    {
                        field: "Password",
                        message: "Incorrect password",
                    }
                ];
                res.status(400).json({ logs });
                return { logs };
            }
        }
        else {
            const valid = (_student.studentPassword === studentPassword);
            if (valid) {
                collection = db.collection('it_cs_students');
                let _studentDetails = await collection.findOne({ _id: studentId });
                req.session.authenticationID = (_student._id).toString();
                logs =
                    {
                        field: "First Login",
                        _id: _studentDetails._id,
                        studentName: _studentDetails.studentName,
                        studentMailId: _studentDetails.studentMailId,
                        studentCollegeId: _studentDetails.studentCollegeId,
                        studentContactNumber: _studentDetails.studentContactNumber,
                        studentBalance: _student.studentBalance
                    };
                res.status(200).json(logs);
                return { logs };
            }
            else {
                logs = [
                    {
                        field: "Password",
                        message: "Incorrect password",
                    }
                ];
                res.status(400).json({ logs });
                return { logs };
            }
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const me = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ];
        res.status(400).json({ logs });
        return null;
    }
    logs = [
        {
            field: "Logged in",
            message: req.session.authenticationID,
        }
    ];
    res.status(200).json({ logs });
    return req.session.authenticationID;
};
const studentLogOut = async (req, res) => {
    let logs;
    try {
        req.session.destroy((err) => {
            res.clearCookie('vgcid');
            if (err) {
                console.log(err);
                logs = [
                    {
                        field: "Error in Clearing Cookie",
                        message: "Please contact the administrator",
                    }
                ];
                res.status(400).json({ logs });
                return;
            }
            logs = [
                {
                    field: "Successful Logout",
                    message: "Logged out",
                }
            ];
            res.status(200).json({ logs });
            return;
        });
    }
    catch (e) {
        console.log(e);
        logs = [
            {
                field: "Error in Clearing Cookie",
                message: "Please contact the administrator",
            }
        ];
        res.status(400).json({ logs });
        throw e;
    }
};
const studentChangePassword = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ];
        res.status(400).json({ logs });
        return null;
    }
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        const studentId = req.session.authenticationID;
        const studentPassword = req.body.studentPassword;
        collection = db.collection('student');
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs = [
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    }
                ];
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
                throw new Error(err);
            }
        }
        const hashedPassword = await argon2_1.default.hash(studentPassword);
        let updatedPassword = await collection.updateOne({ _id: studentId }, { $set: { studentPassword: hashedPassword, studentBalance: 0 } });
        if (updatedPassword.acknowledged) {
            logs = [
                {
                    field: "Successful Updation",
                    message: "Password changed of user " + studentId,
                }
            ];
            res.status(200).json({ logs });
            return { logs };
        }
        else {
            logs = [
                {
                    field: "Mongo Error",
                    message: "Password change failed",
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
const studentGetBalance = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ];
        res.status(400).json({ logs });
        return null;
    }
    const db = await connection_1.connection.getDb();
    let collection = db.collection('student');
    try {
        const studentId = req.session.authenticationID;
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs =
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    };
                res.status(400).json({ logs });
                return { logs };
            }
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        if (_student.studentBalance === -1) {
            logs = {
                field: "Password Change Required",
                message: "The student has not changed their password yet"
            };
            res.status(400).json({ logs });
            return { logs };
        }
        else {
            logs = _student.studentBalance;
            res.status(200).json(logs);
            return { logs };
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const studentSetApplication = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    console.log(req.body);
    const studentApplicationData = req.body;
    const _filename = req.file.filename;
    try {
        let _link = await (0, imgur_1.uploadOnImgur)(_filename);
        studentApplicationData.studentApplicationFile = _link;
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
        collection = db.collection('student_application');
        let _student_application;
        const _student = new StudentApplication_1.default({
            studentApplicationCollegeId: req.session.authenticationID,
            studentApplicationName: studentApplicationData.studentApplicationName,
            studentApplicationDescription: studentApplicationData.studentApplicationDescription,
            studentApplicationDate: studentApplicationData.studentApplicationDate,
            studentApplicationOrganizer: studentApplicationData.studentApplicationOrganizer,
            studentApplicationCategory: studentApplicationData.studentApplicationCategory,
            studentApplicationFile: studentApplicationData.studentApplicationFile,
            studentApplicationStatus: "Pending",
            studentApplicationIssuedCoins: -1
        });
        try {
            _student_application = await collection.insertOne(_student);
        }
        catch (e) {
            logs = {
                field: "Student Application Error",
                message: e
            };
            return res.status(400).json({ logs });
        }
        if (_student_application.acknowledged) {
            console.log(_student_application);
            logs = {
                field: "Student Application Posted",
                studentApplicationCollegeId: _student.studentApplicationCollegeId,
                studentApplicationName: _student.studentApplicationName,
                studentApplicationDescription: _student.studentApplicationDescription,
                studentApplicationDate: _student.studentApplicationDescription,
                studentApplicationOrganizer: _student.studentApplicationOrganizer,
                studentApplicationCategory: _student.studentApplicationCategory,
                studentApplicationFile: _student.studentApplicationFile,
                studentApplicationStatus: _student.studentApplicationStatus,
                studentApplicationIssuedCoins: _student.studentApplicationIssuedCoins
            };
            return res.status(200).json({ logs });
        }
        else {
            logs =
                {
                    field: "Unknown Error Occurred",
                    message: "Better check with administrator",
                };
            res.status(400).json({ logs });
            return { logs };
        }
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
const studentGetApplications = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    console.log(req);
    console.log("Inside Student GET controller");
    let allApplications;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allApplications = await db.collection('student_application').find({ studentApplicationCollegeId: req.session.authenticationID }).toArray();
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        res.status(200).json(allApplications);
        console.log(allApplications);
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
const studentGetEvents = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    console.log(req);
    console.log("Inside Student GET controller");
    let allEvents;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allEvents = await db.collection('event').find({}).toArray();
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        res.status(200).json(allEvents);
        console.log(allEvents);
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
const studentGetAdvertisements = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    console.log(req);
    console.log("Inside Student GET controller");
    let allAdvertisements;
    try {
        const db = await connection_1.connection.getDb();
        console.log(db);
        try {
            allAdvertisements = await db.collection('advertisement').find({}).toArray();
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        res.status(200).json(allAdvertisements);
        console.log(allAdvertisements);
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
const studentCanteenTransfer = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    const _amount = req.body.amount;
    const db = await connection_1.connection.getDb();
    let collection = db.collection('student');
    try {
        const studentId = req.session.authenticationID;
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs =
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    };
                res.status(400).json({ logs });
                return { logs };
            }
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        if (_student.studentBalance < _amount) {
            logs =
                {
                    field: "Insufficient Student Balance",
                    message: "Student has balance lower than amount",
                };
            res.status(400).json({ logs });
            return;
        }
        let studentBurn;
        let rewarderMint;
        try {
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id: studentId }, { $inc: { studentBalance: (-1 * parseInt(_amount)) } });
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id: 'canteen' }, { $inc: { balance: parseInt(_amount) } });
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        if (studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('global');
            await collection.updateOne({ _id: 'total_redeemed' }, { $inc: { value: parseInt(_amount) } });
            await collection.updateOne({ _id: 'total_in_circulation' }, { $inc: { value: (-1 * parseInt(_amount)) } });
            logs = {
                field: "Successful Canteen Transfer",
                message: "Student paid to Canteen"
            };
            res.status(200).json(logs);
            return { logs };
        }
        else if (!studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id: 'canteen' }, { $inc: { balance: (-1 * parseInt(_amount)) } });
            logs = {
                field: "Student Burn Error",
                message: "Student Balance could not be reduced"
            };
            res.status(400).json({ logs });
            return { logs };
        }
        else if (studentBurn.acknowledged && !rewarderMint.acknowledged) {
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id: studentId }, { $inc: { studentBalance: parseInt(_amount) } });
            logs = {
                field: "Rewarder Mint Error",
                message: "Coins could not be transferred to rewarder"
            };
            res.status(400).json({ logs });
            return { logs };
        }
        else {
            logs = {
                field: "Rewarder Mint Error & Student Burn Error",
                message: "Coins could not be transferred to rewarder & Student Balance could not be reduced"
            };
            res.status(400).json({ logs });
            return { logs };
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
const studentStationeryTransfer = async (req, res) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            };
        res.status(400).json({ logs });
        return null;
    }
    const _amount = req.body.amount;
    const db = await connection_1.connection.getDb();
    let collection = db.collection('student');
    try {
        const studentId = req.session.authenticationID;
        let _student;
        try {
            _student = await collection.findOne({ _id: studentId });
            if (_student === null) {
                logs =
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    };
                res.status(400).json({ logs });
                return { logs };
            }
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        if (_student.studentBalance < _amount) {
            logs =
                {
                    field: "Insufficient Student Balance",
                    message: "Student has balance lower than amount",
                };
            res.status(400).json({ logs });
            return;
        }
        let studentBurn;
        let rewarderMint;
        try {
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id: studentId }, { $inc: { studentBalance: (-1 * parseInt(_amount)) } });
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id: 'stationery' }, { $inc: { balance: parseInt(_amount) } });
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err);
                logs = {
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                };
                res.status(400).json({ logs });
                return { logs };
            }
            else {
                res.status(400).json({ err });
                throw new Error(err);
            }
        }
        if (studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('global');
            await collection.updateOne({ _id: 'total_redeemed' }, { $inc: { value: parseInt(_amount) } });
            await collection.updateOne({ _id: 'total_in_circulation' }, { $inc: { value: (-1 * parseInt(_amount)) } });
            logs = {
                field: "Successful stationery Transfer",
                message: "Student paid to stationery"
            };
            res.status(200).json(logs);
            return { logs };
        }
        else if (!studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id: 'stationery' }, { $inc: { balance: (-1 * parseInt(_amount)) } });
            logs = {
                field: "Student Burn Error",
                message: "Student Balance could not be reduced"
            };
            res.status(400).json({ logs });
            return { logs };
        }
        else if (studentBurn.acknowledged && !rewarderMint.acknowledged) {
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id: studentId }, { $inc: { studentBalance: parseInt(_amount) } });
            logs = {
                field: "Rewarder Mint Error",
                message: "Coins could not be transferred to rewarder"
            };
            res.status(400).json({ logs });
            return { logs };
        }
        else {
            logs = {
                field: "Rewarder Mint Error & Student Burn Error",
                message: "Coins could not be transferred to rewarder & Student Balance could not be reduced"
            };
            res.status(400).json({ logs });
            return { logs };
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
module.exports = {
    studentSignUp, studentLogIn, studentLogOut, me, studentChangePassword, studentGetBalance, studentGetApplications, studentSetApplication, studentGetEvents, studentGetAdvertisements, studentCanteenTransfer, studentStationeryTransfer
};
//# sourceMappingURL=StudentController.js.map