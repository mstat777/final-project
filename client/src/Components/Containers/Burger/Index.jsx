import styles from './burger.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function Burger() {
    const navigate = useNavigate();

    const { userInfo } = useSelector(state => state.user);

    const [burgerOpen, setBurgerOpen] = useState(false);

    const toggleBurgerOrLogin = () => {
        !userInfo.isLogged ? navigate("/user/signin") : setBurgerOpen(!burgerOpen);
    }

    return (
        <div className={`${styles.burger_menu} ${burgerOpen ? styles.show_burger_menu : styles.hide_burger_menu }`}>

            <div className={styles.burger_items_ctn}>
                {userInfo.isLogged && (
                        <>
                            <NavLink to={"/"} className={styles.burger_item}>Info personnelles</NavLink>
                            <NavLink to={"/"} className={styles.burger_item}>Mes réservations</NavLink>
                            <NavLink to={"/user/signout"} className={styles.burger_item} onClick={() => toggleBurgerOrLogin()}>déconnexion</NavLink>    
                        </>
                    )}
            </div>
            
            <button 
            onClick={() => toggleBurgerOrLogin()} 
            className={styles.burger_icon} 
            title="Espace utilisateur" 
            data-content={!userInfo.isLogged ? "connexion" : ""} 
            data-width={!userInfo.isLogged ? `&{9em}` : "5em"}>
                <FontAwesomeIcon icon={faUser} className={styles.burger_icon_fawesome}/>
            </button>

        </div>
    )
}

export default Burger;