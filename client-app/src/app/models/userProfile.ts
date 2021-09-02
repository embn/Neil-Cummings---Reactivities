import { User } from "./user";

export interface UserProfile {
    userName: string;
    displayName: string;
    bio?: string;
    image?: string;
}

export class UserProfile implements UserProfile {
    constructor(user: User) {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}