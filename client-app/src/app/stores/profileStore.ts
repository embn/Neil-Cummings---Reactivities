import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, UserProfile } from "../models/userProfile";
import { store } from "./store";

export default class ProfileStore {
    profile: UserProfile | null = null;
    loadingProfile = false;
    uploadingPhoto = false;
    loadingPhoto = false;
    savingProfile = false;

    constructor() {
        makeAutoObservable(this);
    }
    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.userName;
        }
        return false;
    }
    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profile.get(userName);
            runInAction(() => {
                this.profile = profile;
            });

        } catch (error) {
            //don't need to handle becuause we have centralized handling in agent interceptor
            console.log(error);
            
        } finally {
            runInAction(() => this.loadingProfile = false);
        }
    }
    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profile.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.uploadingPhoto = false);
        }
    }
    setMainPhoto = async (photo: Photo) => {
        this.loadingPhoto = true;
        try {
            await agent.Profile.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingPhoto = false);
        }
    }
    deletePhoto = async (photo: Photo) => {
        this.loadingPhoto = true;
        try {
            await agent.Profile.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    const index = this.profile.photos.findIndex(p => p.id === photo.id);
                    this.profile.photos.splice(index, 1);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingPhoto = false);
        }
    }
    updateProfile = async (profile : Partial<UserProfile>)  => {
        this.savingProfile = true;
        try {
            await agent.Profile.update(profile);
            runInAction(() => {
                let userDisplayName = store.userStore.user?.displayName;
                if (this.profile?.displayName && profile.displayName !== userDisplayName) {
                    
                    this.profile.displayName = profile.displayName!;
                    this.profile.bio = profile.bio!;
                    store.userStore.setDisplayName(profile.displayName!);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.savingProfile = false);
        }
    }
}