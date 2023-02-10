"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Committee_1 = __importDefault(require("../models/Committee"));
const connection_1 = require("../connection");
const mongodb_1 = require("mongodb");
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
        console.log(alreadyExisting.committeeEmail);
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
                type: alreadyExisting.committeeType,
                balance: alreadyExisting.committeeBalance,
            },
            message: "Login successfull",
            accessToken: token,
        });
    }
    catch (e) {
        res.status(400).json({ e });
        throw e;
    }
};
module.exports = {
    committeeSignUp, committeeLogin
};
//# sourceMappingURL=CommitteeController.js.map