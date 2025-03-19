import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import BugList from './screens/BugList';
import BugDetail from './screens/BugDetail';
import BugForm from './screens/BugForm';
import Login from './screens/Login';
import Register from './screens/Register';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <ErrorBoundary>
            <Switch>
              <Route path='/' component={BugList} exact />
              <Route path='/bug/:id' component={BugDetail} />
              <Route path='/create' component={BugForm} />
              <Route path='/edit/:id' component={BugForm} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
            </Switch>
          </ErrorBoundary>
        </Container>
      </main>
    </Router>
  );
}

export default App;