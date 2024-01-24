import styles from './user.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../../../store/slices/user';
import { setLogMessage } from '../../../store/slices/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import MainBtn from '../../Containers/buttons/MainBtn/Index';

function Signin(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo, logMessage } =  useSelector((state) => state.user);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    /* pour l'oeil d'affichage du mdp */
    const [passInputType, setPassInputType] = useState("password");
    const [passIcon, setPassIcon] = useState(faEyeSlash);

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handlePassIconToggle() {
        if (passInputType === "password") {
            setPassIcon(faEye);
            setPassInputType('text')
         } else {
            setPassIcon(faEyeSlash)
            setPassInputType('password')
         }
    }

    function handleOnFocus(){
        dispatch(setLogMessage(''));
        setErrMsg('');
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
            setErrMsg(json.msg);
        }
    }

    return <main id="signin">
            <section className={`${styles.sign_section} ${styles.signin}`}>

                { (logMessage && !email && !password) && 
                    <p className={styles.ok_msg}>{logMessage}</p> }
                { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
                
                <h1>Je me connecte</h1>

                <form onSubmit={handleSubmit} className={styles.sign_form}>

                    <label> 
                        <FontAwesomeIcon icon={faUser} className={styles.input_icon}/>
                        <input type="email" 
                                name="email" 
                                placeholder="Votre adresse mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={handleOnFocus}
                                required/>
                    </label>

                    <label> 
                        <FontAwesomeIcon icon={faLock} className={styles.input_icon}/>
                        <input type={passInputType} 
                                name="password" 
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={handleOnFocus}
                                className={styles.pass_input}
                                required/>

                        <button type="button"
                                className={styles.pass_icon_ctn} 
                                onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon} className={styles.pass_icon}/>
                        </button>    

                    </label>
                    
                    <MainBtn type="submit" text="se connecter"/>
                </form>

                <p>Vous n'avez pas encore de compte ? <Link to="/user/signup">En créer un</Link></p>

            </section>
        </main>
}

export default Signin;