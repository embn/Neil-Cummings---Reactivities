import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from '../../features/home/HomePage';
import TestErrors from '../../features/errors/TestErrors';
import ServerError from '../../features/errors/ServerError';
import NotFound from '../../features/errors/NotFound';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import Loading from './Loading';
import ModalContainer from '../common/modals/ModalContainer';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ProfilePage from '../../features/profiles/ProfilePage';
import { Container } from 'semantic-ui-react';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (commonStore.appLoaded === false) return <Loading content='Loading app...' />
  return (
    <>
      {/* 1. the Route path properties determines what gets rendered.
             every matching path gets rendered along side each other

          2. Components highlighted in yellow are regular react components,
             whereas the others are decorated with observer functions (mobx-react-lite)
       */}
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
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
              <Route path=      '/profile/:username' component={ProfilePage} />
              <Route path=      '/errors' component={TestErrors} />
              <Route path=      '/server-error' component={ServerError} />
              <Route path=      '/login' component={LoginForm} />
              <Route component={NotFound} />
            </Switch>

          </Container>
        </>

      )}/>
      
    </>
  );
}

export default observer(App);