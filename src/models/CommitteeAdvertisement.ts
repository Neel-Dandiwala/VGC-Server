import { CommitteeAdvertisementInfo } from "../types/CommitteeAdvertisementInfo";
import { model, Schema } from "mongoose";

const CommitteeAdvertisementSchema: Schema = new Schema({
    advertisementTitle: {
        type: String,
        required: true
    },

    advertisementDescription: {
        type: String,
        required: true
    },

    advertisementExpires:  {
        type: String,
        required: true
    },
    advertisementImageLink:  {
        type: String,
        required: true
    },
    advertisementAmount:  {
        type: String,
        required: true
    },
    advertisementStatus:  {
        type: String,
        required: true
    },
    advertisement_committee_email:  {
        type: String,
        required: true
    },
    
}, {timestamps: true})

export default model<CommitteeAdvertisementInfo>("CommitteeAdvertisement", CommitteeAdvertisementSchema);