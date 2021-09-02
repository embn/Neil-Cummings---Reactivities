import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";

export default observer(function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore;
    //need to tell the hook about type info
    const {id} = useParams<{id : string}>();

    useEffect(() => {
        if (id) loadActivity(id);
    }, /* dependencies */[id, loadActivity]);

    if (loadingInitial || !activity) return <Loading />;
    return (
       <Grid>
           <Grid.Column width={10}>
               <ActivityDetailedHeader activity={activity}/>
               <ActivityDetailedInfo activity={activity}/>
               <ActivityDetailedChat />
           </Grid.Column>
           <Grid.Column width={6}>
               <ActivityDetailedSideBar activity={activity} />
           </Grid.Column>
       </Grid>
    )
});