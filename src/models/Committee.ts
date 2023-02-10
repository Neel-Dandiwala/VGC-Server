import { CommitteeInfo } from "../types/CommitteeInfo";
import { model, Schema } from "mongoose";

const CommitteeSchema: Schema = new Schema({
    _id: {
        type: String,
        required: false
    },

    committeeName: {
        type: String,
        required: true
    },

    committeeType:  {
        type: String,
        required: true
    },

    committeeEmail:  {
        type: String,
        required: true
    },
    
    committeePassword:  {
        type: String,
        required: true
    },
    committeeBalance:  {
        type: Number,
        required: true
    },

}, {timestamps: true})

export default model<CommitteeInfo>("Committee", CommitteeSchema);