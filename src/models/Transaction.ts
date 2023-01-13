import { TransactionInfo } from "../types/TransactionInfo";
import { model, Schema } from "mongoose";

const TransactionSchema: Schema = new Schema({
    to: {
        type: String,
        required: true
    },

    from: {
        type: String,
        required: true
    },

    timestamp:  {
        type: String,
        required: true
    },

    amount:  {
        type: Number,
        required: true
    },

}, {timestamps: true})

export default model<TransactionInfo>("Transaction", TransactionSchema);