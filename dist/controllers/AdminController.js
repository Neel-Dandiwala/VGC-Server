"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
require('dotenv').config();
const AdminPostController = async (req, res) => {
    console.log("Inside Admin post controller");
    console.log(req.body);
    const eventData = req.body;
    const db = await connection_1.connection.getDb();
    let collection;
    try {
        collection = db.collection('admin_posts');
        let _admin_post;
        try {
            _admin_post = await collection.insertOne(req.body);
            console.log(_admin_post);
            console.log("Admin Post inserted Successfully");
            return res.status(200).json({ msg: "Admin post added !" });
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
    res.status(200).json({ message: "Hi" });
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
    AdminPostController, AdminGetEvents
};
//# sourceMappingURL=AdminController.js.map