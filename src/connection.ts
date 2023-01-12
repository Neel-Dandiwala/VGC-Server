require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_CONNECTION_URL;
let _db: any;
export const connection = {

    connectToServer: function (callback: any) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err: any, client: any) {
            _db = client.db('vgc-database');
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    }
};
