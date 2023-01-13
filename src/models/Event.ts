import { EventInfo } from "../types/EventInfo";
import { model, Schema } from "mongoose";

const EventSchema: Schema = new Schema({
    eventName: {
        type: String,
        required: true
    },

    eventDescription: {
        type: String,
        required: true
    },

    venue:  {
        type: String,
        required: true
    },

    date:  {
        type: String,
        required: true
    },

    startTime:  {
        type: String,
        required: true
    },

    endTime:  {
        type: String,
        required: true
    },

    committee:  {
        type: String,
        required: true
    },

    contact:  {
        type: String,
        required: true
    },

    file:  {
        type: String,
        required: false
    },

}, {timestamps: true})

export default model<EventInfo>("Event", EventSchema);