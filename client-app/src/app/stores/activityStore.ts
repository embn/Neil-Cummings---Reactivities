import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/Activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activities = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    formIsOpen: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = true;
 
    constructor() {
        makeAutoObservable(this);
    }

    //computed property
    get activitiesByDate() {
        return Array.from(this.activities.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date)
        ); 
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    /*because we are using 'this' keyword the method needs to be "bound" to the class.
    we achieve this by using arrow function, alternatively the makeObservable could set it as action.bound
    */
    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activities.set(activity.id, activity);
              });
        } catch(error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.get(id);
    }

    deselectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.deselectActivity();
        this.formIsOpen = true;
    }

    closeForm = () => {
        this.formIsOpen = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
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
                this.loading =false;
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
                if ( id === this.selectedActivity?.id) {
                    this.deselectActivity();
                }
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