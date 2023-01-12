import { StudentInfo } from "../types/StudentInfo";
import { model, Schema } from "mongoose";

const StudentSchema: Schema = new Schema({
    _id: {
        type: String,
        required: false
    },

    studentCollegeId: {
        type: String,
        required: true
    },

    studentPassword:  {
        type: String,
        required: true
    },

    temporaryStudentPassword:  {
        type: String,
        required: false
    },

}, {timestamps: true})

export default model<StudentInfo>("Student", StudentSchema);