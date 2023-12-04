import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// HOCs
import WithAuth from "./Components/HOC/WithAuth/Index";
import WithAdminAuth from "./Components/HOC/WithAdminAuth/Index";
import WithFetch from "./Components/HOC/WithFetch/Index";

// Containeurs et pages
import Header from "./Components/Containers/Header/Index";
import Footer from "./Components/Containers/Footer/Index";
import UserDashboardHeader from "./Components/Containers/dashboard/UserHeader/Index";
import AdminDashboardHeader from "./Components/Containers/dashboard/AdminHeader/Index";

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

// User Dashboard
import UserDashboardMyInfos from "./Components/Pages/dashboard/user/MyInfos";
import UserDashboardMyBookings from "./Components/Pages/dashboard/user/MyBookings";
// Admin Dashboard
import AdminDashboardBookings from './Components/Pages/dashboard/admin/Bookings';
import AdminDashboardBookingsCreate from './Components/Pages/dashboard/admin/BookingsCreate';
import AdminDashboardDestinations from './Components/Pages/dashboard/admin/Destinations';
import AdminDashboardDestinationsCreate from './Components/Pages/dashboard/admin/DestinationsCreate';
import AdminDashboardLodgings from './Components/Pages/dashboard/admin/Lodgings';
import AdminDashboardLodgingsCreate from './Components/Pages/dashboard/admin/LodgingsCreate';
import AdminDashboardPacks from './Components/Pages/dashboard/admin/Packs';
import AdminDashboardPacksCreate from './Components/Pages/dashboard/admin/PacksCreate';
import AdminDashboardActivities from './Components/Pages/dashboard/admin/Activities';
import AdminDashboardActivitiesCreate from './Components/Pages/dashboard/admin/ActivitiesCreate';
import AdminDashboardUsers from './Components/Pages/dashboard/admin/Users';
import AdminDashboardUsersCreate from './Components/Pages/dashboard/admin/UsersCreate';

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

function AdminDashboardLayout() {
    return (
        <>
        <AdminDashboardHeader/>
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

            <Route path="/db/user" element={<UserDashboardLayout/>}>
                <Route path="my-infos" element={<WithAuth child={UserDashboardMyInfos} auth="true"/>}/>
                <Route path="my-bookings/:id" element={<WithAuth child={UserDashboardMyBookings} auth="true"/>}/>
            </Route>

            <Route path="/db/admin" element={<AdminDashboardLayout/>}>
                <Route path="my-infos" element={<WithAuth child={UserDashboardMyInfos} auth="true" adminAuth="true"/>}/>
                <Route path="my-bookings/:id" element={<WithAuth child={UserDashboardMyBookings} auth="true" adminAuth="true"/>}/>

                <Route path="bookings" element={<WithAdminAuth child={AdminDashboardBookings} auth="true" adminAuth="true"/>}/>
                <Route path="bookings/search" element={<WithAdminAuth child={AdminDashboardBookings} auth="true" adminAuth="true"/>}/>
                <Route path="bookings/create" element={<WithAdminAuth child={AdminDashboardBookingsCreate} auth="true" adminAuth="true"/>}/>

                <Route path="destinations" element={<WithAdminAuth child={AdminDashboardDestinations} auth="true" adminAuth="true"/>}/>
                <Route path="destinations/search" element={<WithAdminAuth child={AdminDashboardDestinations} auth="true" adminAuth="true"/>}/>
                <Route path="destinations/create" element={<WithAdminAuth child={AdminDashboardDestinationsCreate} auth="true" adminAuth="true"/>}/>

                <Route path="lodgings" element={<WithAdminAuth child={AdminDashboardLodgings} auth="true" adminAuth="true"/>}/>
                <Route path="lodgings/search" element={<WithAdminAuth child={AdminDashboardLodgings} auth="true" adminAuth="true"/>}/>
                <Route path="lodgings/create" element={<WithAdminAuth child={AdminDashboardLodgingsCreate} auth="true" adminAuth="true"/>}/>

                <Route path="packs" element={<WithAdminAuth child={AdminDashboardPacks} auth="true" adminAuth="true"/>}/>
                <Route path="packs/search" element={<WithAdminAuth child={AdminDashboardPacks} auth="true" adminAuth="true"/>}/>
                <Route path="packs/create" element={<WithAdminAuth child={AdminDashboardPacksCreate} auth="true" adminAuth="true"/>}/>

                <Route path="activities" element={<WithAdminAuth child={AdminDashboardActivities} auth="true" adminAuth="true"/>}/>
                <Route path="activities/search" element={<WithAdminAuth child={AdminDashboardActivities} auth="true" adminAuth="true"/>}/>
                <Route path="activities/create" element={<WithAdminAuth child={AdminDashboardActivitiesCreate} auth="true" adminAuth="true"/>}/>

                <Route path="users" element={<WithAdminAuth child={AdminDashboardUsers} auth="true" adminAuth="true"/>}/>
                <Route path="users/search" element={<WithAdminAuth child={AdminDashboardUsers} auth="true" adminAuth="true"/>}/>
                <Route path="users/create" element={<WithAdminAuth child={AdminDashboardUsersCreate} auth="true" adminAuth="true"/>}/>

            </Route>

        </Routes>
        </BrowserRouter>
    );
}

export default App;