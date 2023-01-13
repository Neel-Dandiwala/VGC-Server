import { Document } from "mongoose";

export class EventInfo {
    eventName: string;
    eventDescription: string;
    eventVenue: string;
    eventDate: string;
    eventStartTime: string;
    eventEndTime: string;
    eventCommittee: string;
    eventContact: string;
    eventFile?: string;
}