"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_CONNECTION_URL;
let _db;
exports.connection = {
    connectToServer: function (callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            _db = client.db('vgc-database');
            return callback(err);
        });
    },
    getDb: function () {
        return _db;
    }
};
//# sourceMappingURL=connection.js.map