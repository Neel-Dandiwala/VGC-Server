import { Document } from "mongoose";

export class CommitteeInfo {
    _id?: string;
    committeeName: string;
    committeeType: string;
    committeeEmail: string;
    committeePassword:string;
    committeeBalance:number;
}

