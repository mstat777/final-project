import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { signin } from '../../../store/slices/user';

import styles from './user.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Signin(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo, logMessage } =  useSelector((state) => state.user);

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
        //console.log("email : "+email);
        const res = await fetch(`${BASE_URL}/api/v.0.1/user/signin`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        setMsg(json.msg);
        if(res.status === 200){
            localStorage.setItem("auth", json.TOKEN);
            //console.log("le token a été créé dans localhost");
            //console.log(json);
            dispatch(signin(json));
            //console.log("userInfo.chosenPackID ="+userInfo.chosenPackID);
            // si on n'a pas encore séléctionné un pack, on sera dirigé vers la page d'accueil :
            if (userInfo.chosenPackID === -1) { 
                navigate("/");
            } else {
                navigate(`/booking/${userInfo.chosenPackID}`);
            }    
        } else {
            console.log("res.status n'est pas OK!!!");
        }
    }

    return(
        <main id="signin">

            <div className={styles.signin_div}>
                {/* afficher le message de confirmation après avoir créé un nouveau compte */}
                { (logMessage && !email && !password) && 
                    <p className={styles.ok_msg}>{logMessage}</p> }
                
                <h2>Je me connecte</h2>
                <form onSubmit={handleSubmit} className={styles.sign_form}>

                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faUser} className={styles.input_icon}/>
                        <input type="email" 
                                name="email" 
                                placeholder="Votre adresse mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.sign_input}
                                required/>

                    </div>

                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faLock} className={styles.input_icon}/>
                        <input type={passInputType} 
                                name="password" 
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.pass_input}
                                required/>
                        <span className={styles.pass_icon_ctn} onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon} className={styles.pass_icon}/>
                        </span>
                        
                    </div>
                    
                    <button type="submit">se connecter</button>
                </form>

                { (msg && !email && !password) && 
                        <p className={styles.err_msg}>{msg}</p> }

                <p>Vous n'avez pas encore de compte ? <Link to="/user/signup">En créer un</Link></p>
            </div>

        </main>
    )
}

export default Signin;