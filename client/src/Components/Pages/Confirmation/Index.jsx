import styles from './confirmation.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMediaQuery } from "react-responsive";

function Confirmation(){
    const navigate = useNavigate();

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])

    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            navigate("/");
        }, 10000);
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