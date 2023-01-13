import { AdvertisementInfo } from "../types/AdvertisementInfo";
import { model, Schema } from "mongoose";

const AdvertisementSchema: Schema = new Schema({
    advertismentTitle: {
        type: String,
        required: true
    },

    advertisementText: {
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