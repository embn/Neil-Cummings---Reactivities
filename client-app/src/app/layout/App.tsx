import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

function App() {

  //we only want activityStore from the Store onject, so we deconstruct it. 
  const {activityStore} = useStore();

  //VERY IMPORTANT to pass a DependencyList to useEffect
  //lest the component will re-render itself endlessly fetching data
  useEffect(() => {
    activityStore.loadActivities();
  }, []);

  if (activityStore.loadingInitial) return <Loading content='Loading app' />

  return (
    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);