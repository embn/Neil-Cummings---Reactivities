import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';

function App() {
  // Hooks
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  //VERY IMPORTANT to pass a DependencyList to useEffect
  //lest the component will re-render itself endlessly fetching data
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleDeselectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleDeselectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleFormSubmit(activity: Activity) {
    //... = JS spread syntax
    
    if (activity.id) {
      //if user is submitting an edited activity, then remove the activity from the array and re-insert the edited one.
      setActivities([...activities.filter(x => x.id !== activity.id), activity]);
    }
    else {
      //else user has created a new activity, simply insert
      setActivities([...activities, {...activity, id: uuid()}]);
    }
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleActivityDelete(id: string) {

    
    setActivities(activities.filter(x => x.id !== id));
  }

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          deselectActivity={handleDeselectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          submitForm={handleFormSubmit}
          deleteActivity={handleActivityDelete}
        />
      </Container>
    </>
  );
}

export default App;