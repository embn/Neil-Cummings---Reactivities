import { UserProfile } from "./userProfile";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUserName: string;
    isCancelled: boolean;
    attendees: UserProfile[];
    isGoing: boolean;
    isHost: boolean;
    host?: UserProfile;
}

export class Activity implements Activity {
    constructor(formValues?: ActivityFormValues) {
        Object.assign(this, formValues);
    }
}

export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    date: Date | null = null;
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';

    constructor(formValues?: ActivityFormValues )
    {
        if (formValues) {
            this.id = formValues.id;
            this.title = formValues.title;
            this.date  = formValues.date;
            this.description  = formValues.description;
            this.category  = formValues.category;
            this.city  = formValues.city;
            this.venue  = formValues.venue;
        }
    }
}