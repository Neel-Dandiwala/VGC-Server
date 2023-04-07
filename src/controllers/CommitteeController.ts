import { Request, Response } from 'express';
import { CommitteeInfo } from '../types/CommitteeInfo';
import Committee from '../models/Committee';
import { AdvertisementInfo } from 'src/types/AdvertisementInfo';
import { SponsershipInfo } from 'src/types/SponsershipInfo';

import { ResponseFormat } from "../resolvers/Format";
import argon2 from "argon2";
import {connection} from "../connection";
import {MongoServerError} from 'mongodb'
import { formatDate, addWeeksToDate } from '../utils/DateFormat'
import { uploadOnImgur } from '../imgur';
import { EventInfo } from '../types/EventInfo';
import * as nodemailer from 'nodemailer' 
require('dotenv').config()

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");




const committeeSignUp = async(req:Request, res:Response) => {

    console.log(req.body)
    const db = await connection.getDb();
    let collection;
    try {
        let logs;

        const committeeName = req.body.committee_name
        const committeeType = req.body.committee_type
        const committeeEmail = req.body.committee_email
        const committeePassword = req.body.password
        const committeeBalance = req.body.committee_balance

        console.log(committeeEmail);
        console.log(committeePassword)
        
        
       
        collection = db.collection( 'committee' );
        let alreadyExisting = await collection.findOne({ committeeEmail: committeeEmail })
        console.log(alreadyExisting)
        if (alreadyExisting !== null  ){
            logs = [
                {
                    field: "Committee SignUp Error",
                    message: "Committee already signed up before",
                }
            ]

            res.status(400).json({ logs });
            return {logs}; 
        }

        // let randomPassword = Math.random().toString(36).substring(2, 8)
        // const hashedPassword = await argon2.hash(randomPassword);

        const _committee: CommitteeInfo = new Committee({
            committeeName: committeeName,
            committeePassword:bcrypt.hashSync(committeePassword, 8),
            committeeType: committeeType, 
            committeeEmail: committeeEmail,
            committeeBalance: committeeBalance,
        })

        let result;
        try {
            result = await collection.insertOne(_committee);
            console.log(_committee)
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
            console.log("Committee Registered Successfull")
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
    // res.send("Sign Up in Progress..")
}

const committeeLogin = async(req:Request, res:Response) => {
   
    const db = await connection.getDb();
    let collection;
    try {
        let logs;

        const committeeEmail = req.body.committee_email
        const committeePassword = req.body.committee_password


        collection = db.collection( 'committee' );
        let alreadyExisting = await collection.findOne({ committeeEmail: committeeEmail })
        if (alreadyExisting == null  ){
            logs = [
                {
                    field: "Committee Email Does not exists !",
                    message: "Please Register first to login !",
                }
            ]

            res.status(400).json({ logs });
            return {logs}; 
        }

        // let randomPassword = Math.random().toString(36).substring(2, 8)
        // const hashedPassword = await argon2.hash(randomPassword);
        //User Exists
        
        //Check if passwords  match
        console.log(alreadyExisting)
        
        var passwordIsValid = bcrypt.compareSync(
            req.body.committee_password,
            alreadyExisting.committeePassword
          );
        if (!passwordIsValid) {
        return res.status(401)
            .json({
            accessToken: null,
            message: "Invalid Password!"
            });
        }
        // var token = jwt.sign({
        //     id: committeeEmail
        //   }, process.env.API_SECRET, {
        //     expiresIn: 86400
        //   });
        req.session.authenticationID = alreadyExisting.committeeEmail;
        console.log(req.session.authenticationID)
        console.log("Sending status 200....")
          res.status(200)
          .json({
            committeeUser: {
              email: alreadyExisting.committeeEmail,
              name: alreadyExisting.committeeName,
              type:alreadyExisting.committeeType,
              balance : alreadyExisting.committeeBalance,
            },
            message: "Login successfull",
            // accessToken: token,
          });
        } catch (e) {
            res.status(400).json({ e });
            throw e;
        }
};

const setCommitteeEvent = async (req: Request, res: Response) => {
    console.log("Hi") 
    let logs;
    console.log(req.body)
    console.log(req.session)
    const eventData = req.body as Pick<EventInfo, "eventName" | "eventDescription" | "eventVenue" | "eventDate" | "eventStartTime" | "eventEndTime" | "eventCommittee" | "eventContact" | "eventFile" >
    const _filename = req.file.filename
    console.log(_filename)
    try {
        let _link = await uploadOnImgur(_filename)
        eventData.eventFile = _link
        eventData.eventDate = formatDate((new Date()).toISOString())

    } catch (err) {
        logs = {
            field: "Imgur Error",
            message: "Better check with administrator"
        }
        console.log(logs)
        res.status(400).json(logs)
        return
    }

    const db = await connection.getDb();          
    let collection;
    console.log(req.session.authenticationID)
    try {
        // collection = db.collection('global');
        // await collection.updateOne({ _id:  'total_money_left' },
        // { $inc: { value: parseFloat(eventData.eventAmount) }});
        // await collection.updateOne({ _id:  'total_investment' },
        // { $inc: { value: parseFloat(eventData.eventAmount) }});

        collection = db.collection('committeeEvent');
        let _committee_post;
        try {
            _committee_post = await collection.insertOne(eventData);
    //         // console.log(_admin_post)
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
const getCommitteeEvents = async (req: Request, res: Response) => {

    console.log("Inside Committee GET controller")
    // console.log(req)
    let allevents;
    try {
        const db = await connection.getDb();
        console.log(db)

        try {
            allevents = await db.collection('committeeEvent').find({}).toArray();
            res.status(200).json({ allevents })
            console.log(allevents)
        } catch (e) {
            console.log(e)
        }

    } catch (e) {
        console.log(e)
    }

}

const committeeSetAdvertisement = async (req: Request, res: Response) => {
    let logs;
    const advertisementData = req.body as Pick<AdvertisementInfo, "advertisementName" | "advertisementDescription" | "advertisementExpires" | "advertisementImageLink" | "advertisementAmount" | "advertisementStatus" | "advertisement_committee_email">
    const _filename = req.file.filename
    console.log(_filename)
    try {
        console.log("_link")
        let _link = await uploadOnImgur(_filename)
        console.log("_link")
        console.log(_link)
        advertisementData.advertisementImageLink = _link
        advertisementData.advertisementExpires = formatDate(addWeeksToDate(new Date(), 2).toISOString())
        console.log(advertisementData)
    } catch (err) {
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
        // collection = db.collection('global');
        // await collection.updateOne({ _id:  'total_money_left' },
        // { $inc: { value: parseFloat(advertisementData.advertisementAmount) }});
        // await collection.updateOne({ _id:  'total_investment' },
        // { $inc: { value: parseFloat(advertisementData.advertisementAmount) }});
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
const committeeSetSponsershipForm = async (req: Request, res: Response) => {
    let logs;
    const sponsershipData = req.body as Pick<SponsershipInfo, "sponserName" | "sponserDescription" | "sponserAmount" | "sponsershipStatus" | "sponser_committee_email">
  

    const db = await connection.getDb();
    let collection;

    try {
        // collection = db.collection('global');
        // await collection.updateOne({ _id:  'total_money_left' },
        // { $inc: { value: parseFloat(advertisementData.advertisementAmount) }});
        // await collection.updateOne({ _id:  'total_investment' },
        // { $inc: { value: parseFloat(advertisementData.advertisementAmount) }});
        collection = db.collection('sponsership');

        let _admin_post;
        try {
            _admin_post = await collection.insertOne(sponsershipData);
            // console.log(_admin_post)
            logs = {
                field: "Sponsership form Posted on Database",
            }
            return res.status(200).json({ logs })

        } catch (e) {
            logs = {
                field: "Sponsership form Insertion Error",
                message: e
            }
            return res.status(400).json({ logs })
        }


    } catch (e) {
        res.status(400).json({ e });
        throw e;
    }
}
// 

module.exports = {
    committeeSignUp,committeeLogin,setCommitteeEvent,getCommitteeEvents,committeeSetAdvertisement,committeeSetSponsershipForm
}