import { Request, Response } from 'express';
import { CommitteeInfo } from '../types/CommitteeInfo';
import Committee from '../models/Committee';
import { ResponseFormat } from "../resolvers/Format";
import argon2 from "argon2";
import {connection} from "../connection";
import {MongoServerError} from 'mongodb'
import { uploadOnImgur } from '../imgur';
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
        console.log(alreadyExisting.committeeEmail)
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
        var token = jwt.sign({
            id: committeeEmail
          }, process.env.API_SECRET, {
            expiresIn: 86400
          });
          res.status(200)
          .json({
            committeeUser: {
              email: alreadyExisting.committeeEmail,
              name: alreadyExisting.committeeName,
              type:alreadyExisting.committeeType,
              balance : alreadyExisting.committeeBalance,
            },
            message: "Login successfull",
            accessToken: token,
          });
        } catch (e) {
            res.status(400).json({ e });
            throw e;
        }
  
};

module.exports = {
    committeeSignUp,committeeLogin
}