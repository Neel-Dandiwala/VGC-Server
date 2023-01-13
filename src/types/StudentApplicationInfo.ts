import { Document } from "mongoose";

export class StudentApplicationInfo {
    studentCollegeId?: string;
    studentApplicationName: string;
    studentApplicationDescription: string;
    studentApplicationDate: string;
    studentApplicationOrganizer: string;
    studentApplicationFile: string;
}

