import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// ---------------------- HOCs --------------------------
import WithAuth from "./Components/HOC/WithAuth/Index";
import WithAdminAuth from "./Components/HOC/WithAdminAuth/Index";
import WithFetch from "./Components/HOC/WithFetch/Index";

// ------------------- Containeurs  -----------------------
import Header from "./Components/Containers/Header/Index";
import Footer from "./Components/Containers/Footer/Index";
import UserDashHeader from "./Components/Containers/dashboard/UserHeader/Index";
import AdminDashHeader from "./Components/Containers/dashboard/AdminHeader/Index";

// ---------------------- Pages  ---------------------------
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
// Page Not Found :
import NotFound from "./Components/Pages/NotFound/Index";

// ------------------- User Dashboard -----------------------
import UserDashMyInfos from "./Components/Pages/dashboard/user/MyInfos";
import UserDashMyBookings from "./Components/Pages/dashboard/user/MyBookings";
import UserDashBookingModify from "./Components/Pages/dashboard/user/Modify/Index";
import UserDashBookingModifiedSummary from "./Components/Pages/dashboard/user/Summary/Index";

// ------------------- Admin Dashboard ----------------------
import AdminDashBookings from './Components/Pages/dashboard/admin/Bookings/Index';

import AdminDashDestinations from './Components/Pages/dashboard/admin/Destinations/Index';
//import AdminDashDestinationModify from './Components/Pages/dashboard/admin/Destinations/Modify/Index';

import AdminDashLodgings from './Components/Pages/dashboard/admin/Lodgings/Index';
import AdminDashLodgingModify from './Components/Pages/dashboard/admin/Lodgings/Modify/Index';
import AdminDashLodgingCreate from './Components/Pages/dashboard/admin/Lodgings/Create/Index';

import AdminDashPacks from './Components/Pages/dashboard/admin/Packs/Index';

import AdminDashActivities from './Components/Pages/dashboard/admin/Activities/Index';

import AdminDashUsers from './Components/Pages/dashboard/admin/Users/Index';

function BasicLayout() {
    return (
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}

function UserDashLayout() {
    return (
        <>
        <Header/>
        <UserDashHeader/>
        <Outlet/>
        </>
    )
}

function AdminDashLayout() {
    return (
        <>
        <AdminDashHeader/>
        <Outlet/>
        </>
    )
}

function App() {
    return (
        <BrowserRouter basename="/">
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
                <Route path="summary/:id" element={<WithAuth child={Summary} auth="true"/>}/>
                <Route path="confirmation" element={<WithAuth child={Confirmation} auth="true"/>}/>

                <Route path="not-found" element={<NotFound/>}/>
            </Route>

            {/* DASHBOARD utilisateur */}
            <Route path="/db/user" element={<UserDashLayout/>}>
                {/* afficher les infos persos de l'utilisateur */}
                <Route path="my-infos" element={<WithAuth child={UserDashMyInfos} auth="true"/>}/>
                {/* modifier une réservation de l'utilisateur */}
                <Route path="booking-modify" element={<WithAuth child={UserDashBookingModify} auth="true"/>}/>
                <Route path="booking-summary" element={<WithAuth child={UserDashBookingModifiedSummary} auth="true"/>}/>
                {/* afficher les réservations de l'utilisateur */}
                <Route path="my-bookings/:id" element={<WithAuth child={UserDashMyBookings} auth="true"/>}/>

            </Route>

            {/* DASHBOARD admin/superadmin */}
            <Route path="/db/admin" element={<AdminDashLayout/>}>
                <Route path="my-infos" element={<WithAuth child={UserDashMyInfos} auth="true" adminAuth="true"/>}/>
                <Route path="my-bookings/:id" element={<WithAuth child={UserDashMyBookings} auth="true" adminAuth="true"/>}/>

                <Route path="bookings" element={<WithAdminAuth child={AdminDashBookings} auth="true" adminAuth="true"/>}/>
                <Route path="bookings/search" element={<WithAdminAuth child={AdminDashBookings} auth="true" adminAuth="true"/>}/>

                <Route path="destinations" element={<WithAdminAuth child={AdminDashDestinations} auth="true" adminAuth="true"/>}/>
                <Route path="destinations/search" element={<WithAdminAuth child={AdminDashDestinations} auth="true" adminAuth="true"/>}/>
                {/*<Route path="destinations/modify/:index" element={<WithAdminAuth child={AdminDashDestinationModify} auth="true" adminAuth="true"/>}/>*/}

                <Route path="lodgings" element={<WithAdminAuth child={AdminDashLodgings} auth="true" adminAuth="true"/>}/>
                <Route path="lodgings/create" element={<WithAdminAuth child={AdminDashLodgingCreate} auth="true" adminAuth="true"/>}/>
                <Route path="lodgings/modify/:index" element={<WithAdminAuth child={AdminDashLodgingModify} auth="true" adminAuth="true"/>}/>

                <Route path="packs" element={<WithAdminAuth child={AdminDashPacks} auth="true" adminAuth="true"/>}/>
                <Route path="packs/search" element={<WithAdminAuth child={AdminDashPacks} auth="true" adminAuth="true"/>}/>

                <Route path="activities" element={<WithAdminAuth child={AdminDashActivities} auth="true" adminAuth="true"/>}/>
                <Route path="activities/search" element={<WithAdminAuth child={AdminDashActivities} auth="true" adminAuth="true"/>}/>

                <Route path="users" element={<WithAdminAuth child={AdminDashUsers} auth="true" adminAuth="true"/>}/>
                <Route path="users/search" element={<WithAdminAuth child={AdminDashUsers} auth="true" adminAuth="true"/>}/>

            </Route>

        </Routes>
        </BrowserRouter>
    );
}

export default App;