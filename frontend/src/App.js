import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import Footer from './components/Footer';
import PxxScreen from './screens/PxxScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/pxx' component={PxxScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
