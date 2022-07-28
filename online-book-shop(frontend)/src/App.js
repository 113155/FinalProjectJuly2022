import './App.css';
import Signup from './components/Signup';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Confirm from './components/Confirm';
import { getCurrentUser } from './UserPool';
import Home from './components/Home';
import ListAdmin from './components/ListAdmin';
import ListCustomer from './components/ListCustomer';
import NewBook from './components/NewBook';
import Cart from './components/Cart';
import Orders from './components/Orders';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={!getCurrentUser() ? <Welcome /> : <Navigate to='/home' />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={localStorage.getItem('currentUser') ? <Home /> : <Navigate to='/' />} />
        <Route path='/list' element={localStorage.getItem('currentUser') &&
          JSON.parse(localStorage.getItem('currentUser'))["custom:role"] === 'admin' ? <ListAdmin /> : <ListCustomer />} />
        <Route path='/newbook' element={localStorage.getItem('currentUser') &&
          JSON.parse(localStorage.getItem('currentUser'))["custom:role"] === 'admin' ? <NewBook /> : <Navigate to='/' />} />
        <Route path='/cart' element={localStorage.getItem('currentUser') &&
          JSON.parse(localStorage.getItem('currentUser'))["custom:role"] === 'customer' ? <Cart /> : <Navigate to='/home' />} />
        <Route path='/orders' element={localStorage.getItem('currentUser') &&
          JSON.parse(localStorage.getItem('currentUser'))["custom:role"] === 'customer' ? <Orders /> : <Navigate to='/home' />} />
      </Routes>
    </Router>
  );
}

export default App;
