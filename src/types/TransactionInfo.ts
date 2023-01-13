import { Document } from "mongoose";

export class TransactionInfo {
    to: string;
    from: string;
    amount: number;
    timestamp: string;
}

