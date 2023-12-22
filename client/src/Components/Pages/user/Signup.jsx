import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import styles from './user.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faPhone, faEnvelope, faLocationDot, faCakeCandles, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserReg } from '@fortawesome/free-regular-svg-icons';

import { validateInput } from '../../Functions/sanitize';
import { setLogMessage } from '../../../store/slices/user';

function Signup(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [address, setAddress] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [occupation, setOccupation] = useState("");
    const [password, setPassword] = useState("");

    const[checkBoxNewsL, setCheckBoxNewsL] = useState(false);
    const[checkBoxPrivacy, setCheckBoxPrivacy] = useState(false);

    // pour l'icone "l'oeil" d'affichage du mdp :
    const [passInputType, setPassInputType] = useState("password");
    const [passIcon, setPassIcon] = useState(faEyeSlash);

    // afficher le placeholder de la date de naissance :
    const [inputDateType, setInputDateType] = useState("text");

    const [msg, setMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valides:
    const [isFormValidated, setIsFormValidated] = useState(false);

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

    // vérifier si tous les champs sont valides. Si OUI, le form est valide :
    const checkFormValidation = () => {
        if (!checkBoxPrivacy){
            const errPrivacyMsg = "Veuillez cocher la case pour accepter les conditions d'utilisations.\n"
            setErrMsg(errMsg+errPrivacyMsg);
        } else if (checkBoxPrivacy){
            console.log("checkBoxPrivacy = "+checkBoxPrivacy);
            // on vérifie tous les champs :
            const lNameVerif = validateInput("lastName", lastName.trim());
            const fNameVerif = validateInput("firstName",firstName.trim());
            // si un numéro de tél est rempli, on vérifie. Si non, on vérifie pas, car ce n'est pas un champ obligatoire :
            let telVerif = { isValid: true, msg: '' }
            if (tel) {
                telVerif = validateInput("tel", tel.trim());
            }
            // si un numéro de tél est rempli, on vérifie. Si non, on vérifie pas, car ce n'est pas un champ obligatoire :
            let addressVerif = { isValid: true, msg: '' }
            if (address) {
                addressVerif = validateInput("address", address.trim());
            }
            //
            const bDateVerif = validateInput("birthDate",birthDate);
            const passVerif= validateInput("password",password.trim());

            // rassembler toutes les messages d'erreur pour les afficher au-dessous du formulaire :
            setErrMsg(lNameVerif.msg 
                        + fNameVerif.msg 
                        + telVerif.msg
                        + addressVerif.msg
                        + bDateVerif.msg 
                        + passVerif.msg);
            // si tous les champs obligatoires sont validés, on valide le formulaire :
            ( lNameVerif.isValid && 
            fNameVerif.isValid && 
            telVerif.isValid &&
            addressVerif.isValid &&
            bDateVerif.isValid && 
            passVerif.isValid ) ? setIsFormValidated(true) : setIsFormValidated(false);
            console.log("isFormValidated = "+isFormValidated);
        }
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        if (isFormValidated) {
            console.log("Signup form sent!");
            const res = await fetch(`${BASE_URL}/api/v.0.1/user/signup`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    lastName,
                    firstName,
                    email, 
                    tel,
                    address,
                    birthDate,
                    occupation,
                    password,
                    checkBoxNewsL})
            });
            const json = await res.json();
            setMsg(json.msg);
            
            if (res.status === 201) {
                dispatch(setLogMessage("Votre compte a bien été créé.\nVous pouvez désormais vous connecter."));
                navigate("/user/signin");
            }
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        // vérifier si tous les champs sont valides :
        checkFormValidation();
    }

    return <main id="signup">

            <div className={styles.signup_div}>
                <h2>Je crée mon compte</h2>     

                <form onSubmit={handleSubmit} className={styles.sign_form}>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faUser} className={styles.input_icon}/>  
                        <input type="text" 
                                name="lastName" 
                                placeholder="Nom*"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.sign_input}
                                required/>
                    </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faUserReg} className={styles.input_icon}/>  
                        <input type="text" 
                                name="firstName" 
                                placeholder="Prénom*"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.sign_input}
                                required/>
                    </div>            
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faEnvelope} className={styles.input_icon}/>  
                        <input type="email" 
                                name="email" 
                                placeholder="Email*"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.sign_input}
                                required/>
                    </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faPhone} className={styles.input_icon}/>  
                        <input type="tel" 
                                name="tel" 
                                placeholder="Numéro de téléphone"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                className={styles.sign_input}/> 
                    </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faLocationDot} className={styles.input_icon}/>  
                        <textarea name="address" 
                                placeholder="Adresse postale"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={styles.sign_textarea} />
                    </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faCakeCandles} className={styles.input_icon}/>  
                        <input type={inputDateType} 
                                name="birthDate" 
                                placeholder="Date de naissance*"
                                min="1920-01-01"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                onFocus={() => setInputDateType("date")}
                                className={styles.sign_input}
                                required/> 
                        </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faBriefcase} className={styles.input_icon}/>  
                        <input type="text" 
                                pattern="[a-zA-ZÀ-Ÿ-\s]{0,50}"
                                name="occupation" 
                                placeholder="Métier"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                className={styles.sign_input}/>
                        </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faLock} className={styles.input_icon}/>
                        <input type={passInputType}  
                                name="password" 
                                placeholder="Mot de passe*"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.pass_input}
                                required/>
                        <span className={styles.pass_icon_ctn} onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon} className={styles.pass_icon}/>
                        </span>
                    </div>
                    <div className={styles.input_ctn}> 
                        <label className={styles.label_checkbox}>
                            <input type="checkbox" 
                                name="checkBoxNewsL"
                                checked={ checkBoxNewsL } 
                                onChange={() => setCheckBoxNewsL(!checkBoxNewsL)}/>
                            <span>Je souhaite m'inscrire à la newsletter</span>
                        </label>
                    </div>
                    <div className={styles.input_ctn}> 
                        <label className={styles.label_checkbox}>
                            <input type="checkbox" 
                                name="checkBoxPrivacy"
                                checked={ checkBoxPrivacy } 
                                onChange={() => setCheckBoxPrivacy(!checkBoxPrivacy)}/>
                            <span>En cochant cette case, vous déclarez avoir lu et accepter nos <Link>conditions d'utilisation</Link> et la <Link>politique de confidentialité</Link></span>
                        </label>
                    </div>

                    <button type="submit">s'inscrire</button>
                </form>

                { errMsg ? <p className={styles.err_msg}>{errMsg}</p> : null}
                { (msg && !lastName) ? 
                        <p className={styles.err_msg}>{msg}</p> : null}
            </div>

        </main>
}

export default Signup;