import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './screens/LoginScreen';
import PxxEditScreen from './screens/PxxEditScreen';
import ConsultantEditScreen from './screens/ConsultantEditScreen';
import ManageConsultantScreen from './screens/ManageConsultantScreen';
import ManageUsersScreen from './screens/manageUsersScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/login' component={LoginScreen} />
          <Route path='/pxx' component={PxxEditScreen} exact />
          <Route path='/pxx/:id' component={PxxEditScreen} exact />
          <Route path='/editconsultant/:id' component={ConsultantEditScreen} exact />
          <Route path='/admin/consultants' component={ManageConsultantScreen} exact />
          <Route path='/admin/users' component={ManageUsersScreen} exact />
          <Route path='/admin/consultant/add' component={ConsultantEditScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
