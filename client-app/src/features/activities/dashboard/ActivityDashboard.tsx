import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

//We are destructuring the activities property from the Props object being passed
export default observer(function ActivityDashboard() {

    const {activityStore} = useStore();
    const {selectedActivity, formIsOpen: editMode} = activityStore;
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {/* <bool> && <component> will render component only if true */}
                {selectedActivity && !editMode &&
                <ActivityDetails />}
                {editMode && <ActivityForm/>}
            </Grid.Column>
        </Grid>
    )
});