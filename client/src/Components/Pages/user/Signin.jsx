import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

import { signin } from '../../../store/slices/user';

import styles from './user.module.css';

function Signin(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [msg, setMsg] = useState(null);
    
    async function handleSubmit(e){
        e.preventDefault();
        //console.log("SignIN form sent!");
        console.log("email : "+email);
        const res = await fetch("/api/v.0.1/user/signin", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        setMsg(json.msg);
        if(res.status === 200){
            localStorage.setItem("auth", json.TOKEN);
            console.log("le token a été créé dans localhost");
            dispatch(signin({email}));
            navigate("/");
        } else {
            console.log("res.status n'est pas OK!!!");
        }
    }

    return(
        <main id="signin">
            {msg && <p className={styles.msg}>{msg}</p>}
            <form onSubmit={handleSubmit} className={styles.sign_form}>
                <input type="email" 
                        name="email" 
                        placeholder="Votre adresse mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" 
                        name="password" 
                        placeholder="Votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">se connecter</button>
            </form>
            <p>Vous n'avez pas encore de compte ? <Link to="/user/signup">En créer un</Link></p>
        </main>
    )
}

export default Signin;