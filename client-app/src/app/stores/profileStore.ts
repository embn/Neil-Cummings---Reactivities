import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, UserProfile } from "../models/userProfile";
import { store } from "./store";

export default class ProfileStore {
    profile: UserProfile | null = null;
    followings: UserProfile[] = [];
    loadingProfile = false;
    loadingFollowings = false;
    uploadingPhoto = false;
    loadingPhoto = false;
    savingProfile = false;
    loading = false;
    activeTab = 0;
    
    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.activeTab,
            activeTab => {
                let predicate;
                if (activeTab === 3) {
                    predicate = 'followers';
                }
                if (activeTab === 4) {
                    predicate = 'following';
                }
                if (predicate) {
                    this.loadFollowing(predicate);
                }
                else {
                    this.followings = [];
                }
            }
        )
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
                if (this.profile?.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName!);
                }
                this.profile = {...this.profile, ...profile as UserProfile};
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.savingProfile = false);
        }
    }
    updateFollowing = async (userName: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profile.updateFollowing(userName);
            store.activityStore.updateAttendeeFollowing(userName)
            runInAction(() => {
                if (this.profile && this.profile.userName !== store.userStore.user?.userName && this.profile.userName === userName) {
                    //user is looking at a different user profile
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.userName === store.userStore.user?.userName) {
                    //user is looking at their own user profile
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                //forEach doesnt cant do break 
                for (let i = 0; i < this.followings.length; i++) {
                    const profile = this.followings[i];
                    if (profile.userName === userName) {
                        following ? profile.followersCount++ : profile.followersCount--;
                        profile.following = !profile.following;
                        break;
                    }
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => { this.loading = false; })
        }
    }
    loadFollowing = async (predicate: string) => {
        this.loadingFollowings = true
        try {
            const followings = await agent.Profile.listFollowing(this.profile!.userName, predicate);
            console.log(followings)
            runInAction(() => {
                this.followings = followings;
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loadingFollowings = false;
            });
        }
    }
    setActiveTab = (tab: number) => {
        this.activeTab = tab;
    }
}