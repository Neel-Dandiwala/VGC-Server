import { AdminPostInfo } from "../types/AdminPostInfo";
import { model, Schema } from "mongoose";

const AdminPostSchema: Schema = new Schema({

    eventName: {
        type: String,
        required: true
    },

    eventDescription:  {
        type: String,
        required: true
    },

    eventDate:  {
        type: String,
        required: true
    },

    eventImageLink:  {
        type: String,
        required: true
    },

}, {timestamps: true})

export default model<AdminPostInfo>("AdminPost", AdminPostSchema);