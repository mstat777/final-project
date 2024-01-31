import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signout } from "../../../store/slices/user.js";

function WithAuth({child, auth}){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [tokenIsValid, setTokenIsValid] = useState(false);
    const TOKEN = localStorage.getItem("auth");

    const Child = child;

    useEffect(() => {
        async function checkAuth() {
            if (auth) {
                if (!TOKEN) {
                    navigate("/user/signin");
                }
                if (TOKEN) {
                    const res = await fetch(`${BASE_URL}/api/v.0.1/user/check-token`, {
                        headers: { Authentication: "Bearer " + TOKEN }
                    });

                    if (res.status === 401) {  
                        localStorage.removeItem("auth");
                        dispatch(signout());
                        navigate("/");
                    }
                    if (res.status === 200) { 
                        setTokenIsValid(true);
                    }
                }
            }
            if (!auth) {
                navigate("/user/signin");
            }
        }

        checkAuth();
    },[auth]);

    return (!auth || (auth && tokenIsValid)) && <Child />
}

export default WithAuth;