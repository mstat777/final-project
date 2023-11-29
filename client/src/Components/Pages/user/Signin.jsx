import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { signin } from '../../../store/slices/user';

import styles from './user.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Signin(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } =  useSelector((state) => state.user);

    const [msg, setMsg] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /* pour l'oeil d'affichage du mdp */
    const [passInputType, setPassInputType] = useState("password");
    const [passIcon, setPassIcon] = useState(faEyeSlash);

    function handlePassIconToggle() {
        if (passInputType === "password") {
            setPassIcon(faEye);
            setPassInputType('text')
         } else {
            setPassIcon(faEyeSlash)
            setPassInputType('password')
         }
    }
    
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
            dispatch(signin(json));
            console.log("userInfo.chosenPackID ="+userInfo.chosenPackID);
            // si on n'a pas encore trouvé un pack :
            if (!userInfo.chosenPackID) { 
                navigate("/");
            } else {
                navigate(`/booking/${userInfo.chosenPackID}`);
            }    
        } else {
            console.log("res.status n'est pas OK!!!");
        }
    }

    return(
        <main id="signin" className={styles.signin_main}>
            {msg && <p className={styles.msg}>{msg}</p>}
            <form onSubmit={handleSubmit} className={styles.sign_form}>

                <div className={styles.input_ctn}> 
                    <FontAwesomeIcon icon={faUser} className={styles.input_icon}/>
                    <input type="email" 
                            name="email" 
                            placeholder="Votre adresse mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.sign_input}/>

                </div>

                <div className={styles.input_ctn}> 
                    <FontAwesomeIcon icon={faLock} className={styles.input_icon}/>
                    <input type={passInputType} 
                            name="password" 
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.pass_input}/>
                    <span className={styles.pass_icon_ctn} onClick={handlePassIconToggle}>
                        <FontAwesomeIcon icon={passIcon} className={styles.pass_icon}/>
                    </span>
                    
                </div>
                
                <button type="submit">se connecter</button>
            </form>

            <p>Vous n'avez pas encore de compte ? <Link to="/user/signup">En créer un</Link></p>
        </main>
    )
}

export default Signin;