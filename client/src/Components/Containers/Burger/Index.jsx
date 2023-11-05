import styles from './burger.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Burger() {
    const navigate = useNavigate();

    const { userInfo } = useSelector(state => state.user);

    const [burgerOpen, setBurgerOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const toggleBurgerOrLogin = () => {
        !userInfo.isLogged ? navigate("/user/signin") : setBurgerOpen(!burgerOpen);
    }

    const handleMouseOver = () => {
        setIsHovering(true);
    };
    
    const handleMouseOut = () => {
        setIsHovering(false);
    };

    return (
        <div className={`${styles.burger_menu} ${burgerOpen ? styles.show_burger_menu : styles.hide_burger_menu }`}>

            <div className={styles.burger_items_ctn}>
                {userInfo.isLogged && (
                        <>
                            <button onClick={toggleBurgerOrLogin} className={styles.burger_cross_btn}>
                                <FontAwesomeIcon icon={faXmark} className={styles.burger_cross}/>
                            </button>

                            <NavLink to={"/dashboard/user"} className={styles.burger_item}>Info personnelles</NavLink>
                            <NavLink to={"/dashboard/user"} className={styles.burger_item}>Mes réservations</NavLink>
                            
                            <NavLink to={"/user/signout"} className={styles.burger_item_signout} onClick={() => toggleBurgerOrLogin()}>déconnexion</NavLink>
                        </>
                    )}
            </div>
            
     
                <button 
                onClick={toggleBurgerOrLogin} 
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                className={`${styles.burger_icon} ${burgerOpen ? styles.hide : styles.show}`} 
                title="Espace utilisateur">
                    {(isHovering && !userInfo.isLogged) && <span>CONNEXION&nbsp;</span>}
                    <FontAwesomeIcon icon={faUser} className={styles.burger_icon_fawesome}/>
                </button>

        </div>
    )
}

export default Burger;