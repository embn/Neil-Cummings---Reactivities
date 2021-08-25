import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import HomePage from '../../features/activities/home/HomePage';
import TestErrors from '../../features/activities/errors/TestErrors';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/activities/errors/NotFound';
import ServerError from '../../features/activities/errors/ServerError';

function App() {
  const location = useLocation();
  return (
    <>
      {/* 1. the Route path properties determines what gets rendered.
             every matching path gets rendered along side each other

          2. Components highlighted in yellow are regular react components,
             whereas the others are decorated with observer functions (mobx-react-lite)
       */}
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={HomePage}/>
      <Route path={'/(.+)'} render={() => (
        //fragment (shorthand) is needed because JSX expressions must have a singular parent element
        <>
          <NavBar/>

          <Container style={{marginTop: '7em'}}>
            {/* Purpose of switch is only 1 route can be active 
                Since we re-use ActivityForm for different routes, it's important to set a key
                  otherwise requesting createActivity will not clear the form 
            */}
            <Switch>
              <Route exact path='/activities' component={ActivityDashboard}/>
              <Route path=      '/activities/:id' component={ActivityDetails}/>
              <Route path={[    '/createActivity', 
                                '/manage/:id']} key={location.key} component={ActivityForm}/>
              <Route path=      '/errors' component={TestErrors} />
              <Route path=      '/server-error' component={ServerError} />
              <Route component={NotFound} />
            </Switch>

          </Container>
        </>

      )}/>
      
    </>
  );
}

export default observer(App);