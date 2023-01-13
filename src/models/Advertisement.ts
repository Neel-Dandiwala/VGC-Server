import { AdvertisementInfo } from "../types/AdvertisementInfo";
import { model, Schema } from "mongoose";

const AdvertisementSchema: Schema = new Schema({
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

}, {timestamps: true})

export default model<AdvertisementInfo>("Advertisement", AdvertisementSchema);