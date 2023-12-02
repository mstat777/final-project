import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import styles from './user.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faPhone, faEnvelope, faLocationDot, faCakeCandles, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserReg } from '@fortawesome/free-regular-svg-icons';

function Signup(){

    const navigate = useNavigate();

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [addresse, setAddresse] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [occupation, setOccupation] = useState("");
    const [password, setPassword] = useState("");
    // les 2 checkbox :
    const[checkBoxNewsL, setCheckBoxNewsL] = useState(false);
    const[checkBoxPrivacy, setCheckBoxPrivacy] = useState(false);

    /* pour l'oeil d'affichage du mdp */
    const [passInputType, setPassInputType] = useState("password");
    const [passIcon, setPassIcon] = useState(faEyeSlash);

    const [msg, setMsg] = useState(null);

    // afficher le placeholder de la date de naissance :
    const [inputDateType, setInputDateType] = useState("text");

    function handlePassIconToggle() {
        if (passInputType === "password") {
            setPassIcon(faEye);
            setPassInputType('text')
        } else {
            setPassIcon(faEyeSlash)
            setPassInputType('password')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!checkBoxPrivacy){
            setMsg('json.msg');
        }
        else if (checkBoxPrivacy && lastName && firstName && email && birthDate && password) {
            console.log("Signup form sent!");
            const res = await fetch("/api/v.0.1/user/signup", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                lastName,
                firstName,
                email, 
                tel,
                addresse,
                birthDate,
                occupation,
                password})
            });
            const json = await res.json();
            setMsg(json.msg);
            
            if ( res.status === 201) {
                navigate("/user/signin");
            }
        }
    }

    return(
        <main id="signup" className={styles.signup_main}>

            <div>
                <h2>Je crée mon compte</h2>     
                <form onSubmit={handleSubmit} className={styles.sign_form}>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faUser} className={styles.input_icon}/>  
                        <input type="text" 
                                name="lastName" 
                                placeholder="Nom*"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.sign_input}/>
                    </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faUserReg} className={styles.input_icon}/>  
                        <input type="text" 
                                name="firstName" 
                                placeholder="Prénom*"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.sign_input}/>
                    </div>            
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faEnvelope} className={styles.input_icon}/>  
                        <input type="email" 
                                name="email" 
                                placeholder="Email*"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.sign_input}/>
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
                        <textarea name="addresse" 
                                placeholder="Adresse postale"
                                value={addresse}
                                onChange={(e) => setAddresse(e.target.value)}
                                className={styles.sign_textarea}></textarea>
                    </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faCakeCandles} className={styles.input_icon}/>  
                        <input type={inputDateType} 
                                name="birthDate" 
                                placeholder="Date de naissance*"
                                min="1923-01-01"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                onFocus={() => setInputDateType("date")}
                                className={styles.sign_input}/> 
                        </div>
                    <div className={styles.input_ctn}> 
                        <FontAwesomeIcon icon={faBriefcase} className={styles.input_icon}/>  
                        <input type="text" 
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
                                className={styles.pass_input}/>
                        <span className={styles.pass_icon_ctn} onClick={handlePassIconToggle}>
                            <FontAwesomeIcon icon={passIcon} className={styles.pass_icon}/>
                        </span>
                    </div>
                    <div className={styles.input_ctn}> 
                        <label htmlFor="checkBoxNewsL" className={styles.label_checkbox}>
                            <input type="checkbox" 
                                name="checkBoxNewsL"
                                checked={ checkBoxNewsL } 
                                onChange={() => setCheckBoxNewsL(!checkBoxNewsL)}/>
                            <span>Je souhaite m'inscrire à la newsletter</span>
                        </label>
                    </div>
                    <div className={styles.input_ctn}> 
                        <label htmlFor="checkBoxPrivacy" className={styles.label_checkbox}>
                            <input type="checkbox" 
                                name="checkBoxPrivacy"
                                checked={ checkBoxPrivacy } 
                                onChange={() => setCheckBoxPrivacy(!checkBoxPrivacy)}/>
                            <span>En cochant cette case, vous déclarez avoir lu et accepter nos conditions d'utilisation et la politique de confidentialité</span>
                        </label>
                    </div>

                    <button type="submit">s'inscrire</button>
                </form>
                
                { (msg && !lastName) && 
                            <p className={styles.msg}>{msg}</p>}
            </div>

        </main>
    )
}

export default Signup;