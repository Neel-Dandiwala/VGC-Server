import { Request, Response } from 'express';
import User from '../models/Student';
import { StudentInfo } from '../types/StudentInfo';
import Student from '../models/Student';
import { ResponseFormat } from "../resolvers/Format";
import { validation } from "../utils/validation";
import argon2 from "argon2";
import {connection} from "../connection";
import { CredentialsInput } from "../utils/CredentialsInput";
import {MongoServerError} from 'mongodb'
import * as nodemailer from 'nodemailer' 
require('dotenv').config()

class UserResponse {
    logs?: ResponseFormat[];
    user?: StudentInfo;
}

// const collection = connection.db('rrrdatabase').collection('test');

// @desc   Get User
// @route  GET /user/login
// @access Private
const studentSignUp = async(req:Request, res:Response) => {

    console.log(req)
    const db = await connection.getDb();
    let collection;
    try {
        let logs;

        const studentId = req.body.studentId
        console.log(studentId);
        collection = db.collection( 'it_cs_students' );
        let studentExist = await collection.findOne({ _id: studentId })
        if (studentExist === null){
            logs = [
                {
                    field: "Non-existing Student Error",
                    message: "Student does not exist",
                }
            ]

            res.status(400).json({ logs });
            return {logs}; 
        }
        collection = db.collection( 'student' );
        let alreadyExisting = await collection.findOne({ _id: studentId })
        if (alreadyExisting !== null){
            logs = [
                {
                    field: "Student SignUp Error",
                    message: "Student already signed up before",
                }
            ]

            res.status(400).json({ logs });
            return {logs}; 
        }

        let randomPassword = Math.random().toString(36).substring(2, 8)
        const hashedPassword = await argon2.hash(randomPassword);

        const _student: StudentInfo = new Student({
            _id: studentId,
            studentCollegeId: studentId, 
            studentPassword: hashedPassword,
            
        })

        let result;
        try {
            result = await collection.insertOne(_student);
        } catch (err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = [{ 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }]
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }
        console.log(result);
        if(result.acknowledged){
            console.log(result);
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'vgcoins321@gmail.com',
            //         pass: 'Coinsvg@321'
            //     }
            // });
        
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
                to: "nddandiwala_b19@it.vjti.ac.in",
                subject: "Hello from VGC",
                text: "Your password is " + randomPassword,
                headers: { 'x-myheader': 'test header' }
            };
    
            await transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    logs = [
                        {
                            field: "NodeMailer Error",
                            message: error,
                        }
                    ]
        
                    res.status(400).json({ logs });
                    return {logs}; 
    
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            logs = [
                {
                    field: "Successful Insertion",
                    message: "Done",
                }
            ]

            res.status(200).json({ logs });
            return {logs};
        } else {
            logs = [
                {
                    field: "Unknown Error Occurred",
                    message: "Better check with administrator",
                }
            ]

            res.status(400).json({ logs });
            return {logs};
        }
        

    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }
}

const studentLogIn = async(req:Request, res:Response) => {
    console.log(req)
    const db = await connection.getDb();
    let collection;
        try {
            let logs;
    
            const studentId = req.body.studentId
            const studentPassword = req.body.studentPassword
            collection = db.collection( 'student' );
    
            let _student;
            try {
                _student = await collection.findOne({ _id: studentId })
                if (_student === null){
                    logs = [
                        {
                            field: "Student Not Found",
                            message: "Student never signed up before",
                        }
                    ]
                
                    res.status(400).json({ logs });
                    return {logs}; 
                }
            } catch (err) {
                if (err instanceof MongoServerError && err.code === 11000) {
                    console.error("# Duplicate Data Found:\n", err)
                    logs = [{ 
                        field: "Unexpected Mongo Error",
                        message: "Default Message"
                    }]
                    res.status(400).json({ logs });
                    return {logs};
                    
                }
                else {
                    res.status(400).json({ err });
                    
                    throw new Error(err)
                }
            }
            const valid = await argon2.verify(_student.studentPassword, studentPassword);
            if (valid) {
                
                req.session.authenticationID = (_student._id).toString();
                logs = [
                    {
                        field: "Successful Log In",
                        message: _student._id,
                    }
                ]

                res.status(200).json({ logs });
                return { logs };
            } else {
                logs = [
                    {
                        field: "Password",
                        message: "Incorrect password",
                    }
                ]

                res.status(400).json({ logs });
                return { logs };
            }

        } catch (e) {
            res.status(400).json({ e });
            throw e;
        }
}

const me = async (req: Request, res: Response) => {
    // Not logged in
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ]
        res.status(400).json({ logs });
        return null;
    }
    logs = [
        {
            field: "Logged in",
            message: req.session.authenticationID,
        }
    ]
    res.status(200).json({ logs });
    return req.session.authenticationID;
}

const studentLogOut = async (req: Request, res: Response) => {
    let logs;
    try {
        req.session.destroy((err) => {
            res.clearCookie('vgcid');
            // req.session = null;   
            if (err) {
                console.log(err);
                logs = [
                    {
                        field: "Error in Clearing Cookie",
                        message: "Please contact the administrator",
                    }
                ]
                res.status(400).json({ logs });
                return;
            }

            logs = [
                {
                    field: "Successful Logout",
                    message: "Logged out",
                }
            ]
            res.status(200).json({ logs });
            return;

        })
    } catch (e) {
        console.log(e);
        logs = [
            {
                field: "Error in Clearing Cookie",
                message: "Please contact the administrator",
            }
        ]
        res.status(400).json({ logs });
        throw e;
    }
}

const studentChangePassword = async(req:Request, res:Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs = [
            {
                field: "Not logged in",
                message: "Please log in",
            }
        ]
        res.status(400).json({ logs });
        return null;
    }
    const db = await connection.getDb();
    let collection;
        try {
    
            const studentId = req.session.authenticationID;
            const studentPassword = req.body.studentPassword
            collection = db.collection( 'student' );
    
            let _student;
            try {
                _student = await collection.findOne({ _id: studentId })
                if (_student === null){
                    logs = [
                        {
                            field: "Student Not Found",
                            message: "Student never signed up before",
                        }
                    ]
                
                    res.status(400).json({ logs });
                    return {logs}; 
                }
            } catch (err) {
                if (err instanceof MongoServerError && err.code === 11000) {
                    console.error("# Duplicate Data Found:\n", err)
                    logs = [{ 
                        field: "Unexpected Mongo Error",
                        message: "Default Message"
                    }]
                    res.status(400).json({ logs });
                    return {logs};
                    
                }
                else {
                    res.status(400).json({ err });
                    
                    throw new Error(err)
                }
            }
            const hashedPassword = await argon2.hash(studentPassword);
            let updatedPassword = await collection.updateOne(
                { _id:  studentId },
                { $set: { studentPassword: hashedPassword }}
            )
            if(updatedPassword.acknowledged){
                logs = [
                    {
                        field: "Successful Updation",
                        message: "Password changed of user " + studentId,
                    }
                ]

                res.status(200).json({ logs });
                return { logs };
            } else {
                logs = [
                    {
                        field: "Mongo Error",
                        message: "Password change failed",
                    }
                ]

                res.status(400).json({ logs });
                return { logs };
            }

        } catch (e) {
            res.status(400).json({ e });
            throw e;
        }
}

module.exports = {
    studentSignUp, studentLogIn, studentLogOut, me, studentChangePassword
}