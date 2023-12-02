import styles from './contact.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

function Contact(){
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userMessage, setUserMessage] = useState('');

    const [msg, setMsg] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Contact form sent!");
        const res = await fetch("/api/v.0.1/contact/message", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userName,
                userEmail,
                userMessage})
        });
        const json = await res.json();
        setMsg(json.msg);
        
        if ( res.status === 201) {

        }
    }

    return (
        <main id="contact">

            <div className={styles.contact_section}>
                <div>
                    <p className={styles.title}>infos et réservations</p>
                    <p className={styles.text_tel}><FontAwesomeIcon icon={faPhone} className={styles.phone_icon}/>01 23 45 67 89*</p>
                    <p className={styles.text_small}>Prix d'un appel local</p>
                    <p>Du lundi au vendredi de 9h à 19h, le samedi de 10h à 18h.</p>
                </div>

                <div>
                    <p className={styles.title}>nous contacter</p>
                    <form onSubmit={handleSubmit} className={styles.contact_form}>
                        <label>  
                            <span>Votre nom :</span>
                            <input type="text" 
                                name="userName" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}/> 
                        </label>

                        <label>  
                            <span>Votre mail :</span>
                            <input type="email" 
                                name="userEmail" 
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}/> 
                        </label>

                        <label>  
                            <span>Description :</span>
                            <textarea name="userMessage" 
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}></textarea>
                        </label>

                        <div>
                            <div>
                                <button type="submit">envoyer</button>
                            </div>
                        </div>
                    </form>
                    { (msg && (!userName || !userEmail || !userMessage)) && 
                    <p className={styles.msg}>{msg}</p> }

                </div>
                
            </div>
        </main>
    )
}

export default Contact;