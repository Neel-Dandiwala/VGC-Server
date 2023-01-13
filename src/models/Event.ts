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

    eventVenue:  {
        type: String,
        required: true
    },

    eventDate:  {
        type: String,
        required: true
    },

    eventStartTime:  {
        type: String,
        required: true
    },

    eventEndTime:  {
        type: String,
        required: true
    },

    eventCommittee:  {
        type: String,
        required: true
    },

    eventContact:  {
        type: String,
        required: true
    },

    eventFile:  {
        type: String,
        required: false
    },

}, {timestamps: true})

export default model<EventInfo>("Event", EventSchema);