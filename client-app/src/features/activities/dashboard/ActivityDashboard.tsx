import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
    activities : Activity[];
    selectedActivity : Activity | undefined;
    selectActivity: (id: string) => void;
    deselectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    submitForm: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

//We are destructuring the activities property from the Props object being passed
export default function ActivityDashboard({activities, selectedActivity, selectActivity, deselectActivity, editMode, 
    openForm, closeForm, submitForm, deleteActivity, submitting}: Props) {
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList
                    activities={activities} 
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {/* <bool> && <component> will render component only if true */}
                {selectedActivity && !editMode &&
                <ActivityDetails 
                    activity={selectedActivity} 
                    deselectActivity={deselectActivity}
                    openForm={openForm}
                />}
                {editMode &&
                <ActivityForm 
                    closeForm={closeForm} 
                    activity={selectedActivity} 
                    submitForm={submitForm}
                    submitting={submitting} />}
            </Grid.Column>
        </Grid>
    )
}