import { Document } from "mongoose";

export class EventInfo {
    eventName: string;
    eventDescription: string;
    venue: string;
    date: string;
    startTime: string;
    endTime: string;
    committee: string;
    contact: string;
    file?: string;
}