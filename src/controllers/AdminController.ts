import { Request, Response } from 'express';
import { AdminPostInfo } from '../types/AdminPostInfo';
import AdminPost from '../models/AdminPost';
// import { ResponseFormat } from "../resolvers/Format";
// import argon2 from "argon2";
import { connection } from "../connection";
import { MongoServerError } from 'mongodb'
import { all } from 'axios';
// import * as nodemailer from 'nodemailer' 
require('dotenv').config()



// const collection = connection.db('rrrdatabase').collection('test');
const AdminPostController = async (req: Request, res: Response) => {
    console.log("Inside Admin post controller")
    console.log(req.body)
    const eventData = req.body  as Pick<AdminPostInfo, "eventName" | "eventDescription" | "eventDate" | "eventImageLink" >
    const db = await connection.getDb();
    let collection;

    try {
        collection = db.collection('admin_posts');

        let _admin_post;
        try {
            _admin_post = await collection.insertOne(req.body);
            console.log(_admin_post)
            console.log("Admin Post inserted Successfully")
            return res.status(200).json({ msg: "Admin post added !" })

        } catch (e) {
            console.log(e)
        }


    } catch (e) {
        console.log(e)
    }


    res.status(200).json({ message: "Hi" })
}

const AdminGetEvents = async (req: Request, res: Response) => {

    console.log(req)
    console.log("Inside Admin GET controller")
    // console.log(req)
    let allevents;
    try {
        const db = await connection.getDb();
        console.log(db)

        try {
            allevents = await db.collection('admin_posts').find({}).toArray();
            res.status(200).json({ allevents })
            console.log(allevents)
        } catch (e) {
            console.log(e)
        }

    } catch (e) {
        console.log(e)
    }

}

const ImageTrial = async (req: Request, res: Response) => {
    // console.log(req);
    console.log(req)
    res.status(200).json({ message: "Hi" })
}


module.exports = {
    AdminPostController, AdminGetEvents, ImageTrial
}