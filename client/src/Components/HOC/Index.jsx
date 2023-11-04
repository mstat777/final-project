import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { signout } from "../../store/slices/user";

function HOC({child, auth}){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [tokenIsValid, setTokenIsValid] = useState(false);
    const TOKEN = localStorage.getItem("auth");

    const Child = child;

    const { userInfo } = useSelector(state => state.user);

    useEffect(() => {
        async function checkAuth() {
            if (auth) {
                if (!TOKEN) {
                    navigate("/user/signin");
                    console.log("pas de token");
                }
                if (TOKEN) {
                    const res = await fetch("/api/v.0.1/user/check-token", {
                        headers: { Authentication: "Bearer " + TOKEN }
                    });
                    console.log("token trouvé");
                    if (res.status === 401) {   
                        console.log("le token n'est pas valid");                     
                        localStorage.removeItem("auth");
                        dispatch(signout());
                        navigate("/");
                    }
                    if (res.status === 200) {
                        console.log("le token est valid"); 
                        const json = await res.json();
                        setTokenIsValid(true);
                    }
                }
            }

            if (!auth) {
                navigate("/user/signin");
                console.log("pas logué");
            }
        }

        checkAuth();
    },[auth]);

    return <>{(!auth || (auth && tokenIsValid)) && <Child />}</>
}

export default HOC;