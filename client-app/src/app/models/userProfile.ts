import { User } from "./user";

export interface UserProfile {
    userName: string;
    displayName: string;
    bio?: string;
    image?: string;
    photos?: Photo[];
}
export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}
export class UserProfile implements UserProfile {
    constructor(user: User) {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}
export class UserProfileFormValues {
    displayName: string = '';
    bio?: string = undefined;

    constructor(profile: UserProfile ) {
        this.displayName = profile.displayName;
        this.bio = profile.bio;
    }
}

