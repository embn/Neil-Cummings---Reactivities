import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import Loading from './Loading';

function App() {
  // Hooks
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  //VERY IMPORTANT to pass a DependencyList to useEffect
  //lest the component will re-render itself endlessly fetching data
  useEffect(() => {


    /*axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    }) */
    agent.Activities.list().then(response => { 
      let activities : Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity)
      });
      setActivities(activities);
      setLoading(false);
    });
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
    
    setSubmitting(true);
    //... = JS spread syntax

    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        //remove activity from the array and re-insert the edited one.
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      })
    }
    else {

      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
      })
    }
    setEditMode(false);
    setSubmitting(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {

    setSubmitting(true);
    agent.Activities.delete(id).then(() => {

      setActivities(activities.filter(x => x.id !== id));
      setSubmitting(false);
    });
  }

  if (loading) return <Loading content='Loading app' />

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
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;