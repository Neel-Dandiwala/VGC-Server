import { Request, Response } from 'express';
import { StudentInfo } from '../types/StudentInfo';
import Student from '../models/Student';
import { ResponseFormat } from "../resolvers/Format";
import argon2 from "argon2";
import {connection} from "../connection";
import {MongoServerError} from 'mongodb'
import { uploadOnImgur } from '../imgur';
import * as nodemailer from 'nodemailer' 
import { StudentApplicationInfo } from '../types/StudentApplicationInfo';
import StudentApplication from '../models/StudentApplication';
require('dotenv').config()



// const collection = connection.db('rrrdatabase').collection('test');
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
        // const hashedPassword = await argon2.hash(randomPassword);

        const _student: StudentInfo = new Student({
            _id: studentId,
            studentCollegeId: studentId, 
            studentPassword: randomPassword,
            studentBalance: -1
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
            if(_student.studentPassword.startsWith("$argon")){
                const valid = await argon2.verify(_student.studentPassword, studentPassword);
                if (valid) {
                    collection = db.collection( 'it_cs_students' );
                    let _studentDetails = await collection.findOne({ _id: studentId })
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
                        }

                    res.status(200).json( logs );
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
            } else {
                const valid = (_student.studentPassword === studentPassword);
                if (valid) {
                    collection = db.collection( 'it_cs_students' );
                    let _studentDetails = await collection.findOne({ _id: studentId })
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
                        }

                    res.status(200).json( logs );
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
                { $set: { studentPassword: hashedPassword, studentBalance: 0 }}
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


const studentGetBalance = async(req:Request, res:Response) => {
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
    let collection = db.collection( 'student' );
        try {
    
            const studentId = req.session.authenticationID;
    
            let _student;
            try {
                _student = await collection.findOne({ _id: studentId })
                if (_student === null){
                    logs =
                        {
                            field: "Student Not Found",
                            message: "Student never signed up before",
                        }
                    
                
                    res.status(400).json({ logs });
                    return {logs}; 
                }
            } catch (err) {
                if (err instanceof MongoServerError && err.code === 11000) {
                    console.error("# Duplicate Data Found:\n", err)
                    logs = { 
                        field: "Unexpected Mongo Error",
                        message: "Default Message"
                    }
                    res.status(400).json({ logs });
                    return {logs};
                    
                }
                else {
                    res.status(400).json({ err });
                    
                    throw new Error(err)
                }
            }
            if(_student.studentBalance === -1){
                logs = {
                    field: "Password Change Required",
                    message: "The student has not changed their password yet"
                }

                res.status(400).json({ logs });
                return { logs };
            } else {
                logs = _student.studentBalance
                res.status(200).json(logs);
                return { logs };
            }

        } catch (e) {
            res.status(400).json({ e });
            throw e;
        }
}

const studentSetApplication = async (req: Request, res: Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }
    console.log(req.body)
    const studentApplicationData = req.body  as Pick<StudentApplicationInfo, "studentApplicationName" | "studentApplicationDescription" | "studentApplicationDate" | "studentApplicationOrganizer" | "studentApplicationCategory" | "studentApplicationFile">
    var x = Math.floor(((Math.random() * 10) + 1)%3) + 1;
    const _filename = "temp"+x+".jpg"
    try {
        let _link = await uploadOnImgur(_filename)
        studentApplicationData.studentApplicationFile = _link
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
        collection = db.collection('student_application');
        let _student_application;
        const _student: StudentApplicationInfo = new StudentApplication({
            studentApplicationCollegeId: req.session.authenticationID,
            studentApplicationName: studentApplicationData.studentApplicationName,
            studentApplicationDescription: studentApplicationData.studentApplicationDescription,
            studentApplicationDate: studentApplicationData.studentApplicationDate,
            studentApplicationOrganizer: studentApplicationData.studentApplicationOrganizer,
            studentApplicationCategory: studentApplicationData.studentApplicationCategory,
            studentApplicationFile: studentApplicationData.studentApplicationFile,
            studentApplicationStatus: "Pending",
            studentApplicationIssuedCoins: 0
        })
        try {
            _student_application = await collection.insertOne(_student);
            // console.log(_admin_post)

        } catch (e) {
            logs = {
                field: "Student Application Error",
                message: e
            }
            return res.status(400).json({ logs })
        }

        if(_student_application.acknowledged) {
            console.log(_student_application)
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
            }
            return res.status(200).json({ logs })
        } else {
            logs =
                {
                    field: "Unknown Error Occurred",
                    message: "Better check with administrator",
                }

            res.status(400).json({ logs });
            return {logs};
        }


    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }
  
}

const studentGetApplications = async (req: Request, res: Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }
    console.log(req)
    console.log("Inside Student GET controller")
    // console.log(req)
    let allApplications;
    try {
        const db = await connection.getDb();
        console.log(db)

        try {
            allApplications = await db.collection('student_application').find({ studentApplicationCollegeId: req.session.authenticationID}).toArray();
            
        } catch (err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }

        res.status(200).json(allApplications)
        console.log(allApplications)

    } catch (e) {
        console.log(e)
        throw e
    }
}

const studentGetEvents = async (req: Request, res: Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }
    console.log(req)
    console.log("Inside Student GET controller")
    // console.log(req)
    let allEvents;
    try {
        const db = await connection.getDb();
        console.log(db)

        try {
            allEvents = await db.collection('event').find({ }).toArray();
            
        } catch (err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }
        res.status(200).json(allEvents)
        console.log(allEvents)

    } catch (e) {
        console.log(e)
        throw e
    }

}

const studentGetAdvertisements = async (req: Request, res: Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }
    console.log(req)
    console.log("Inside Student GET controller")
    // console.log(req)
    let allAdvertisements;
    try {
        const db = await connection.getDb();
        console.log(db)

        try {
            allAdvertisements = await db.collection('advertisement').find({ }).toArray();
            
        } catch (err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }
        res.status(200).json(allAdvertisements)
        console.log(allAdvertisements)

    } catch (e) {
        console.log(e)
        throw e
    }

}

const studentCanteenTransfer = async (req: Request, res: Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }

    const _amount:number = +req.body.amount 

    const db = await connection.getDb();
    let collection = db.collection( 'student' );
    try {

        const studentId = req.session.authenticationID;

        let _student;
        try {
            _student = await collection.findOne({ _id: studentId })
            if (_student === null){
                logs =
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    }
                
            
                res.status(400).json({ logs });
                return {logs}; 
            }
        } catch(err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }
        if (_student.studentBalance < _amount) {
            logs =
                    {
                        field: "Insufficient Student Balance",
                        message: "Student has balance lower than amount",
                    }
                
            res.status(400).json({ logs });
            return; 
        }

        let studentBurn;
        let rewarderMint;

        try {
            
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id:  studentId },
                { $inc: { studentBalance: (-1 * _amount) }});
            
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id:  'canteen' },
                { $inc: { balance: _amount }});

        } catch(err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }

        if(studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('global');
            await collection.updateOne({ _id:  'total_redeemed' },
                { $inc: { value: _amount }});
            await collection.updateOne({ _id:  'total_in_circulation' },
                { $inc: { value: (-1 * _amount) }});
            logs = { 
                field: "Successful Canteen Transfer",
                message: "Student paid to Canteen"
            }
            res.status(200).json(logs);
            return {logs};
            
        } else if(!studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id:  'canteen' },
                { $inc: { balance: (-1 * _amount) }});
            logs = { 
                field: "Student Burn Error",
                message: "Student Balance could not be reduced"
            }
            res.status(400).json({ logs });
            return {logs};
        } else if (studentBurn.acknowledged && !rewarderMint.acknowledged) {
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id:  studentId },
                { $inc: { studentBalance:  _amount }});
            logs = { 
                field: "Rewarder Mint Error",
                message: "Coins could not be transferred to rewarder"
            }
            res.status(400).json({ logs });
            return {logs};
        } else {
            logs = { 
                field: "Rewarder Mint Error & Student Burn Error",
                message: "Coins could not be transferred to rewarder & Student Balance could not be reduced"
            }
            res.status(400).json({ logs });
            return {logs};
        }
    } catch (e) {
        console.log(e)
        throw e
    }
    
}

const studentStationeryTransfer = async (req: Request, res: Response) => {
    let logs;
    if (!req.session.authenticationID) {
        logs =
            {
                field: "Not logged in",
                message: "Please log in",
            }
        
        res.status(400).json({ logs });
        return null;
    }

    const _amount:number = +req.body.amount 

    const db = await connection.getDb();
    let collection = db.collection( 'student' );
    try {

        const studentId = req.session.authenticationID;

        let _student;
        try {
            _student = await collection.findOne({ _id: studentId })
            if (_student === null){
                logs =
                    {
                        field: "Student Not Found",
                        message: "Student never signed up before",
                    }
                
            
                res.status(400).json({ logs });
                return {logs}; 
            }
        } catch(err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }
        if (_student.studentBalance < _amount) {
            logs =
                    {
                        field: "Insufficient Student Balance",
                        message: "Student has balance lower than amount",
                    }
                
            res.status(400).json({ logs });
            return; 
        }

        let studentBurn;
        let rewarderMint;

        try {
            
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id:  studentId },
                { $inc: { studentBalance: (-1 * _amount) }});
            
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id:  'stationery' },
                { $inc: { balance: _amount }});

        } catch(err) {
            if (err instanceof MongoServerError && err.code === 11000) {
                console.error("# Duplicate Data Found:\n", err)
                logs = { 
                    field: "Unexpected Mongo Error",
                    message: "Default Message"
                }
                res.status(400).json({ logs });
                return {logs};
                
            }
            else {
                res.status(400).json({ err });
                
                throw new Error(err)
            }
        }

        if(studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('global');
            await collection.updateOne({ _id:  'total_redeemed' },
                { $inc: { value: _amount}});
            await collection.updateOne({ _id:  'total_in_circulation' },
                { $inc: { value: (-1 * _amount) }});
            logs = { 
                field: "Successful stationery Transfer",
                message: "Student paid to stationery"
            }
            res.status(200).json(logs);
            return {logs};
            
        } else if(!studentBurn.acknowledged && rewarderMint.acknowledged) {
            collection = db.collection('rewarder');
            rewarderMint = await collection.updateOne({ _id:  'stationery' },
                { $inc: { balance: (-1 * _amount) }});
            logs = { 
                field: "Student Burn Error",
                message: "Student Balance could not be reduced"
            }
            res.status(400).json({ logs });
            return {logs};
        } else if (studentBurn.acknowledged && !rewarderMint.acknowledged) {
            collection = db.collection('student');
            studentBurn = await collection.updateOne({ _id:  studentId },
                { $inc: { studentBalance:  _amount }});
            logs = { 
                field: "Rewarder Mint Error",
                message: "Coins could not be transferred to rewarder"
            }
            res.status(400).json({ logs });
            return {logs};
        } else {
            logs = { 
                field: "Rewarder Mint Error & Student Burn Error",
                message: "Coins could not be transferred to rewarder & Student Balance could not be reduced"
            }
            res.status(400).json({ logs });
            return {logs};
        }
    } catch (e) {
        console.log(e)
        throw e
    }
    
}

module.exports = {
    studentSignUp, studentLogIn, studentLogOut, me, studentChangePassword, studentGetBalance, studentGetApplications, studentSetApplication, studentGetEvents, studentGetAdvertisements, studentCanteenTransfer, studentStationeryTransfer
}