import {format} from 'date-fns';
import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination, PagingParams } from '../models/pagination';
import { UserProfile } from "../models/userProfile";
import { store } from "./store";

export default class ActivityStore {
    activities = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    formIsOpen: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);


    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                //When user changes filter we reset paging
                this.pagingParams = new PagingParams();
                this.activities.clear();
                this.loadActivities();
            }
        )
    }
    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees.some(x => x.userName === user.userName);
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees.find(x => x.userName === activity.hostUserName) as UserProfile
        }
        activity.date = new Date(activity.date!);
        this.activities.set(activity.id, activity)
    }
    private getActivity = (id: string) => {
        return this.activities.get(id);
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })
        return params;
    }
    get activitiesByDate() {
        return Array.from(this.activities.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime()
        ); 
    }
    //property properly computed from a computed property
    get groupedActivities() {

        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                /*we use object property accessor to get the Activity[] which has the particular date 
                if the Activity[] is truthy then we 
                */
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})/* initial value used to build return value of reduce */
        );
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }
    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate)
        {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);

        }
    }
    /*because we are using 'this' keyword the method needs to be "bound" to the class.
    we achieve this by using arrow function, alternatively the makeObservable could set it as action.bound
    */
    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Activities.list(this.axiosParams);
            result.data.forEach(activity => {
                this.setActivity(activity);
            });
            this.setPagination(result.pagination);
        } catch(error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    //async is syntactic sugar. it compiles to promise syntax
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                });
            }
            catch (error) {
                console.log(error);
                
            } finally {
                this.setLoadingInitial(false);
            }

        }
        //need to return so our return value is guaranteed to be Promise<Activity>
        return activity;
    }

    createActivity = async (formValues: ActivityFormValues) => {

        const user = store.userStore.user;
        const attendee = new UserProfile(user!);
        try {
            await agent.Activities.create(formValues);
            const activity = new Activity(formValues);
            activity.hostUserName = user!.userName;
            activity.attendees = [attendee];
            this.setActivity(activity);
            //runInAction is necessary to avoid the following MobX warning:
            //"Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed"
            runInAction(() => {
                this.selectedActivity = activity;
            });
        } catch(error) {
            console.log(error);       
        }
    }

    updateActivity = async (formValues : ActivityFormValues) => {
        try {
            await agent.Activities.update(formValues);
            runInAction(() => {
                if (formValues.id) {
                    let updatedActivity = { 
                        ...this.getActivity(formValues.id), ...formValues 
                    } as Activity;
                    this.activities.set(formValues.id, updatedActivity);
                    this.selectedActivity = updatedActivity;
                }
                
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities.delete(id);
                this.loading = false;
            });
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    let index = this.selectedActivity.attendees.findIndex(x => x.userName === user?.userName);
                    this.selectedActivity.attendees.splice(index, 1);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new UserProfile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activities.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }
    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activities.set(this.selectedActivity!.id, this.selectedActivity!);
        });
            
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
    clearSelectedActivity = () => {
        runInAction(() => {
            this.selectedActivity = undefined;
        });
    }
    updateAttendeeFollowing = (userName: string) => {
        this.activities.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === userName) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            });
        });
    }
}