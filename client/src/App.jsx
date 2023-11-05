import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import HOC from "./Components/HOC/Index";

import Header from "./Components/Containers/Header/Index";
import Footer from "./Components/Containers/Footer/Index";

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
import UserDashboard from "./Components/Pages/user/Dashboard/Index";

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

function DashboardLayout() {
  return <Outlet/>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<BasicLayout />}>
            <Route index element={<Home/>} />
            <Route path="holidays" element={<Holidays/>} />
            <Route path="agency" element={<Agency/>} />
            <Route path="contact" element={<Contact/>} />
            
            <Route path="user">
              <Route path="signin" element={<Signin/>} />
              <Route path="signup" element={<Signup/>} />
              <Route path="signout" element={<Signout/>} /> 
            </Route>
            
            <Route path="detail/:id" element={<Detail/>} />
            <Route path="booking/:id" element={<HOC child={Booking} auth="true"/>} />
            <Route path="summary/:id" element={<Summary/>} />
            <Route path="confirmation" element={<Confirmation/>} />

            <Route path="not-found" element={<NotFound/>} />
        </Route>

        <Route path="/dashboard/user" element={<DashboardLayout/>}>
            <Route index element={<HOC child={UserDashboard} auth="true"/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;