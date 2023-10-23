import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import styles from './user.module.css';

function Signup(){

    const navigate = useNavigate();

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [addresse, setAddresse] = useState("");
    const [birthday, setBirthday] = useState("");
    const [profession, setProfession] = useState("");
    const [password, setPassword] = useState("");

    const [msg, setMsg] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
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
                birthday,
                profession,
                password})
        });
        const json = await res.json();
        setMsg(json.msg);
        
        if ( res.status === 201) {
            navigate("/user/signin");
        }
    }

    return(
        <main id="signup">

            {msg && <p className={styles.msg}>{msg}</p>}

            <form onSubmit={handleSubmit} className={styles.sign_form}>
                <input type="text" 
                        name="lastName" 
                        placeholder="Votre nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}/>
                <input type="text" 
                        name="firstName" 
                        placeholder="Votre prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}/>      
                <input type="email" 
                        name="email" 
                        placeholder="Votre adresse mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                <input type="tel" 
                        name="tel" 
                        placeholder="Votre numéro de téléphone"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}/>    
                <textarea type="text" 
                        name="addresse" 
                        placeholder="Votre adresse postale"
                        value={addresse}
                        onChange={(e) => setAddresse(e.target.value)}></textarea>
                <input type="date" 
                        name="birthday" 
                        placeholder="Votre date de naissance"
                        min="1923-01-01"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}/> 
                <input type="text" 
                        name="profession" 
                        placeholder="Votre métier"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}/>
                <input type="password" 
                        name="password" 
                        placeholder="Votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">s'inscrire</button>
            </form>

        </main>
    )
}

export default Signup;