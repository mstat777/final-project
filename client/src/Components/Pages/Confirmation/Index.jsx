import styles from './confirmation.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Confirmation(){

    const navigate = useNavigate();

    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            navigate("/");
        }, 5000);
        return () => clearTimeout(redirectTimeout);
    }, []);

    return (
        <main id="confirmation">

            <div className={styles.confirmation_section}>

                <span>Merci pour votre réservation !</span>
                <p>Dans quelques instants vous serez redirigé vers la page d'Accueil.</p>

            </div>

        </main>
    )
}

export default Confirmation;