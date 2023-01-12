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
const nodemailer = __importStar(require("nodemailer"));
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
                    pass: 'qvvmzcganvpuajsr',
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
                req.session.authenticationID = (_student._id).toString();
                logs =
                    {
                        field: "Normal Login",
                        message: _student._id,
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
                req.session.authenticationID = (_student._id).toString();
                logs =
                    {
                        field: "First Login",
                        message: _student._id,
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
        let updatedPassword = await collection.updateOne({ _id: studentId }, { $set: { studentPassword: hashedPassword } });
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
module.exports = {
    studentSignUp, studentLogIn, studentLogOut, me, studentChangePassword
};
//# sourceMappingURL=StudentController.js.map