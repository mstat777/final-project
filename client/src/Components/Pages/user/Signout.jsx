import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signout } from '../../../store/slices/user';

import styles from './user.module.css';

function Signout(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        localStorage.removeItem('auth');
        dispatch(signout());
        navigate("/");
    },[])
    
    return null;
}

export default Signout;