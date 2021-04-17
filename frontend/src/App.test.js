import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
//import { render, screen } from '@testing-library/react';
import App from './App';

Enzyme.configure({ adapter: new EnzymeAdapter() });

test('renders non-empty component withour crashing', () => {
  const wrapper = shallow(<App />);
  // console.log(wrapper.debug()); // see html in the wrapper

  expect(wrapper.exists()).toBe(true);

  // render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
