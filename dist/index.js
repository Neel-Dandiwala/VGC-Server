"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("./connection");
const fileUpload = require('express-fileupload');
require('dotenv').config();
const main = async () => {
    const PORT = 3000;
    await connection_1.connection.connectToServer(async function (err, client) {
        if (err)
            console.log(err);
        console.log("Database Connected");
    });
    const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
    const sessionStore = new MongoDBStore({
        uri: process.env.DATABASE_URL || 'mongodb+srv://mongodb:mongodb@vgc-cluster.mkfxwgn.mongodb.net/vgc-database?retryWrites=true&w=majority',
        collection: 'session'
    });
    sessionStore.on('error', function (error) {
        console.log(error);
    });
    const app = (0, express_1.default)();
    app.set("trust proxy", true);
    app.use((0, cors_1.default)({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
    }));
    app.use((0, express_session_1.default)({
        name: 'vgcid',
        secret: 'VVKSAN',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'lax',
            domain: "http://localhost:3000/",
        },
        store: sessionStore,
        unset: 'destroy',
        saveUninitialized: false,
        resave: false,
    }));
    app.use(express_1.default.json());
    app.use(require('./routes/StudentRoutes'));
    app.use(require('./routes/QRRoutes'));
    app.use(require('./routes/AdminRoutes'));
    app.use(require('./routes/CommitteeRoutes'));
    app.use(fileUpload());
    app.get("/healthz", (_, res) => {
        res.send("Health Checkup 123");
    });
    app.listen(PORT, () => {
        console.log("Server started on localhost:3000");
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map