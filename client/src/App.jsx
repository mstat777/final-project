import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HOC from "./Components/HOC/Index";
import Header from "./Components/Containers/Header/Index";
import Footer from "./Components/Containers/Footer/Index";
import Home from "./Components/Pages/Home/Index";
import Holidays from "./Components/Pages/Holidays/Index";
import Agency from "./Components/Pages/Agency/Index";
import Contact from "./Components/Pages/Contact/Index";
import Signin from "./Components/Pages/user/Signin";
import Signup from "./Components/Pages/user/Signup";
import Signout from "./Components/Pages/user/Signout";
import Dashboard from "./Components/Pages/user/Dashboard";
import Detail from "./Components/Pages/Detail/Index";
import NotFound from "./Components/Pages/NotFound/Index";

function App() {
  return (
    <BrowserRouter>
      <Header/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/holidays" element={<Holidays/>} />
        <Route path="/agency" element={<Agency/>} />
        <Route path="/contact" element={<Contact/>} />
        
        <Route path="/user">
          <Route path="signin" element={<Signin/>} />
          <Route path="signup" element={<Signup/>} />
          <Route path="signout" element={<Signout/>} />
          <Route path="dashboard" element={<HOC child={Dashboard} auth="true"/>} />
        </Route>
        
        <Route path="/detail" element={<Detail/>} />

        <Route path="/not-found" element={<NotFound/>} />
      </Routes>
      
      <Footer/>
    </BrowserRouter>
  );
}

export default App;