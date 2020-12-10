import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './screens/LoginScreen';
//import PxxListScreen from './screens/PxxListScreen'; >>>>>>>> à supprimer ou modifier
import PxxEditScreen from './screens/PxxEditScreen';
import ConsultantEditScreen from './screens/ConsultantEditScreen';
import ManageConsultantScreen from './screens/ManageConsultantScreen';

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
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
