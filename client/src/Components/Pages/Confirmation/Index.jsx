import styles from './Confirmation.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Confirmation(){
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            navigate("/");
        }, 10000);
        return () => clearTimeout(redirectTimeout);
    }, []);

    return <main id="confirmation">
                <div className={styles.confirmation_section}>
                    <span><b>Merci pour votre réservation !</b></span>
                    <p>Dans quelques instants vous serez redirigé vers la page d'Accueil.</p>
                </div>
            </main>
}

export default Confirmation;