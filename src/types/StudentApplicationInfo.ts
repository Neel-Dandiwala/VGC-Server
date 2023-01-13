import { Document } from "mongoose";

export class StudentApplicationInfo {
    studentApplicationCollegeId?: string;
    studentApplicationName: string;
    studentApplicationDescription: string;
    studentApplicationDate: string;
    studentApplicationOrganizer: string;
    studentApplicationFile: string;
    studentApplicationCategory: string;
    studentApplicationStatus?:string;
    studentApplicationIssuedCoins?: number;
}

