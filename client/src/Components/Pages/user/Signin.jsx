import styles from './user.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";

import { signin } from '../../../store/slices/user';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Signin(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo, logMessage } =  useSelector((state) => state.user);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [msg, setMsg] = useState('');

    /* pour l'oeil d'affichage du mdp */
    const [passInputType, setPassInputType] = useState("password");
    const [passIcon, setPassIcon] = useState(faEyeSlash);

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])

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

        const res = await fetch(`${BASE_URL}/api/v.0.1/user/signin`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if(res.status === 200){
            localStorage.setItem("auth", json.TOKEN);

            dispatch(signin(json));

            if (userInfo.chosenPackID === -1) { 
                navigate("/");
            } else {
                navigate(`/booking/${userInfo.chosenPackID}`);
            }    
        } else {
            setMsg(json.msg);
            console.log("res.status n'est pas OK!!!");
        }
    }

    return <main id="signin">

            <div className={styles.signin_div}>

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
                                onFocus={() => setMsg('')}
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
                                onFocus={() => setMsg('')}
                                className={styles.pass_input}
                                required/>
                        <span className={styles.pass_icon_ctn} onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon} className={styles.pass_icon}/>
                        </span>    
                    </div>
                    
                    <button type="submit">se connecter</button>

                </form>

                { msg ? <p className={styles.err_msg}>{msg}</p> : null }

                <p>Vous n'avez pas encore de compte ? <Link to="/user/signup">En créer un</Link></p>
            </div>

        </main>
}

export default Signin;