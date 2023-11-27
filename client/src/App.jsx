import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// HOCs
import WithAuth from "./Components/HOC/WithAuth/Index";
import WithAdminAuth from "./Components/HOC/WithAdminAuth/Index";
import WithFetch from "./Components/HOC/WithFetch/Index";

// Containeurs et pages
import Header from "./Components/Containers/Header/Index";
import Footer from "./Components/Containers/Footer/Index";
import UserDashboardHeader from "./Components/Containers/dashboard/Header/Index";

import Home from "./Components/Pages/Home/Index";
import Holidays from "./Components/Pages/Holidays/Index";
import Agency from "./Components/Pages/Agency/Index";
import Contact from "./Components/Pages/Contact/Index";

import Detail from "./Components/Pages/Detail/Index";
import Booking from "./Components/Pages/Booking/Index";
import Summary from "./Components/Pages/Summary/Index";
import Confirmation from "./Components/Pages/Confirmation/Index";

import Signin from "./Components/Pages/user/Signin";
import Signup from "./Components/Pages/user/Signup";
import Signout from "./Components/Pages/user/Signout";

import UserDashboardInfos from "./Components/Pages/user/dashboard/Infos";
import UserDashboardBookings from "./Components/Pages/user/dashboard/MyBookings";
import AdminDashboardBookings from './Components/Pages/user/dashboard/admin/Bookings';
import AdminDashboardDestinations from './Components/Pages/user/dashboard/admin/Bookings';
import AdminDashboardPacks from './Components/Pages/user/dashboard/admin/Bookings';
import AdminDashboardUsers from './Components/Pages/user/dashboard/admin/Users';

import NotFound from "./Components/Pages/NotFound/Index";

function BasicLayout() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

function UserDashboardLayout() {
  return (
    <>
      <UserDashboardHeader/>
      <Outlet/>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<BasicLayout/>}>
            <Route index element={<WithFetch child={Home}/>}/>
            <Route path="search" element={<WithFetch child={Home}/>}/>

            <Route path="holidays" element={<WithFetch child={Holidays}/>}/>
            <Route path="agency" element={<Agency/>}/>
            <Route path="contact" element={<Contact/>}/>
            
            <Route path="user">
              <Route path="signin" element={<Signin/>}/>
              <Route path="signup" element={<Signup/>}/>
              <Route path="signout" element={<Signout/>}/> 
            </Route>

            <Route path="detail/:id" element={<Detail/>}/>
            <Route path="booking/:id" element={<WithAuth child={Booking} auth="true"/>}/>
            <Route path="summary/:id" element={<Summary/>}/>
            <Route path="confirmation" element={<Confirmation/>}/>

            <Route path="not-found" element={<NotFound/>}/>
        </Route>

        <Route path="/user" element={<UserDashboardLayout/>}>
            <Route path="infos" element={<WithAuth child={UserDashboardInfos} auth="true"/>}/>
            <Route path="mybookings/:id" element={<WithAuth child={UserDashboardBookings} auth="true"/>}/>
        </Route>

        <Route path="/admin" element={<UserDashboardLayout/>}>
            <Route path="bookings" element={<WithAdminAuth child={AdminDashboardBookings} auth="true" adminAuth="true"/>}/>
            <Route path="destinations" element={<WithAdminAuth child={AdminDashboardDestinations} auth="true" adminAuth="true"/>}/>
            <Route path="packs" element={<WithAdminAuth child={AdminDashboardPacks} auth="true" adminAuth="true"/>}/>
            <Route path="users" element={<WithAdminAuth child={AdminDashboardUsers} auth="true" adminAuth="true"/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;