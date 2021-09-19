import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment, ChatCommentFormVaues } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_CHAT_URL + "?activityId=" + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection
                .start()
                .catch(error => console.log('Error establishing connection to hub: ' + error));
            
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {

                runInAction(() => {
                    //.NET doesn add Z to the time strings returned for some reason
                    comments.forEach(comment => comment.createdAt = new Date(comment.createdAt + 'Z'));
                    this.comments = comments
                });
            });

            this.hubConnection.on('RecieveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    //using unshift - preserve descending order by createdAt
                    this.comments.unshift(comment);
                });
            });
        }
    }
    stopHubConnection = () => {
        this.hubConnection?.stop()
            .catch(error => console.log('Error stopping connection to hub: ' + error));
    }
    clearComments = () => {
        runInAction(() => this.comments = []);
    }
    addComment = async (values: ChatCommentFormVaues) => {
        values.activityId = store.activityStore.selectedActivity!.id;
        try {
            debugger;
            await this.hubConnection?.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }

    }
}