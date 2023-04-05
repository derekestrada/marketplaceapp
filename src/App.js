import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Bags from './pages/Bags';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import AddCatch from './pages/AddCatch';
import AddBag from './pages/AddBag';
import 'react-toastify/dist/ReactToastify.css'




function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offer' element={<Offers />} />
          <Route path='/bags' element={<Bags />} />
        <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/add-catch' element={<AddCatch />} />
          <Route path='/add-bag' element={<AddBag />} />

          <Route 
            path='/category/:categoryName/:listingId' 
            element={<Listing />}
          />
          {/* <Route path='/edit-listing/:listingId' element={<EditListing />} /> */}
          <Route path='/contact/:landlordId' element={<Contact />} />
        </Routes>
        <Navbar/>
      </Router> 
      <ToastContainer />
    </>

  );
}

export default App;
