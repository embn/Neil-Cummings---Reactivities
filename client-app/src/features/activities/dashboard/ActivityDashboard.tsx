import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";


export default observer(function ActivityDashboard() {
    // destructuring the activityStore property from the Store object returned
    const {activityStore} = useStore();
    const {loadActivities, activities} = activityStore;
    
    //VERY IMPORTANT to pass a DependencyList to useEffect
    //lest the component will re-render itself endlessly fetching data
    useEffect(() => {
        if (activities.size <= 1) {
            loadActivities();
        }
    }, [activities.size, loadActivities]);

  if (activityStore.loadingInitial) return <Loading content='Loading app' />
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity Filters</h2>
                {/* TODO */}
            </Grid.Column>
        </Grid>
    )
});