import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
    activities = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    formIsOpen: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;
 
    constructor() {
        makeAutoObservable(this);
    }



    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        this.activities.set(activity.id, activity)
    }
    private getActivity = (id: string) => {
        return this.activities.get(id);
    }
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
    //computed property
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



    /*because we are using 'this' keyword the method needs to be "bound" to the class.
    we achieve this by using arrow function, alternatively the makeObservable could set it as action.bound
    */
    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            });
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

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);

            //runInAction is necessary to avoid the following MobX warning:
            //"Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed"
            runInAction(() => {
                this.activities.set(activity.id, activity);
                this.selectedActivity = activity;
                this.formIsOpen = false;
                this.loading =false;
            });
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });            
        }
    }

    updateActivity = async (activity : Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.selectedActivity = activity;
                this.activities.set(activity.id, activity);
                this.formIsOpen = false;
                this.loading = false;
            });
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
                this.formIsOpen = false;
            });
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
}