import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import HomePage from '../../features/activities/home/HomePage';

function App() {
  const location = useLocation();
  return (
    <>
      {/* 1. the Route path properties determines what gets rendered.
             every matching path gets rendered along side each other

          2. Components highlighted in yellow are regular react components,
             whereas the others are decorated with observer functions (mobx-react-lite)
       */}
  
      <Route exact path='/' component={HomePage}/>
      <Route path={'/(.+)'} render={() => (
        //fragment (shorthand) is needed because JSX expressions must have a singular parent element
        <>
          <NavBar/>
          <Container style={{marginTop: '7em'}}>
            
            
            <Route exact path='/activities' component={ActivityDashboard}/>
            <Route path='/activities/:id' component={ActivityDetails}/>

            {/* Since we re-use ActivityForm for different routes, it's important to set a key
                otherwise requesting createActivity will not clear the form 

                https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
            */}
            <Route path={['/createActivity', '/manage/:id']} key={location.key} component={ActivityForm}/>
          </Container>
        </>

      )}/>
      
    </>
  );
}

export default observer(App);