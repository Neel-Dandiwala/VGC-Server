import { StudentApplicationInfo } from "../types/StudentApplicationInfo";
import { model, Schema } from "mongoose";

const StudentApplicationSchema: Schema = new Schema({
    studentCollegeId: {
        type: String,
        required: true
    },

    studentApplicationName: {
        type: String,
        required: true
    },

    studentApplicationDescription:  {
        type: String,
        required: true
    },

    studentApplicationDate:  {
        type: String,
        required: true
    },
    studentApplicationOrganizer:  {
        type: String,
        required: true
    },
    studentApplicationFile:  {
        type: String,
        required: true
    },

}, {timestamps: true})

export default model<StudentApplicationInfo>("StudentApplication", StudentApplicationSchema);