import styles from './burger.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getTokenData } from '../../../Functions/getTokenData';

function Burger() {
    const SK = process.env.REACT_APP_SK;

    const navigate = useNavigate();

    const { userInfo } = useSelector(state => state.user);

    const [burgerOpen, setBurgerOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const TOKEN = localStorage.getItem("auth");

    // si l'utilisateur est authentifié, mais par ex. a rafraichi la page, on vérifie le token et si valide, on récupère ses identifiants :
    useEffect(() => {
        if (!userInfo.isLogged && TOKEN) {
            getTokenData();
        }
    },[userInfo.isLogged])

    const toggleBurgerOrLogin = () => {
        if (!userInfo.isLogged) {
            !TOKEN ? navigate("/user/signin") : setBurgerOpen(!burgerOpen);
        } else {
            setBurgerOpen(!burgerOpen);
        }
    }

    const handleMouseOver = () => {
        setIsHovering(true);
    };
    
    const handleMouseOut = () => {
        setIsHovering(false);
    };

    return (
        <div className={`${styles.burger_menu} ${burgerOpen ? styles.show_burger_menu : styles.hide_burger_menu }`}>
            {/*console.log('userInfo.accountType = '+userInfo.accountType)*/}
            {/*console.log('userInfo.userID = '+userInfo.userID)*/}

            {/* ---------- le containeur des liens ------------ */}
            {(userInfo.isLogged || TOKEN) && userInfo.userID ? 
                <div className={styles.burger_items_ctn}>
  
                    <button onClick={toggleBurgerOrLogin} className={styles.burger_cross_btn}>
                        <FontAwesomeIcon icon={faXmark} className={styles.burger_cross}/>
                    </button>

                    <FontAwesomeIcon icon={faUser} className={styles.user_icon}/>

                    <p className={styles.small_txt}>
                        Espace {userInfo.accountType === "admin" || userInfo.accountType === "superadmin" ? "admin": "client"}
                    </p>
                    <p className={styles.user_txt}>{userInfo.email}</p>
                    <hr/>
                    
                    {(userInfo.accountType === "client") && 
                    <>
                        <NavLink to={"/db/user/my-infos"} className={styles.burger_item}>Mes informations</NavLink>
                        <NavLink to={`/db/user/my-bookings/${userInfo.userID}`} className={styles.burger_item}>Mes réservations</NavLink>
                    </>}

                    {(userInfo.accountType === "admin" || userInfo.accountType === "superadmin") && 
                    <>
                        <NavLink to={"/db/admin/my-infos"} className={styles.burger_item}>Info personnelles</NavLink>
                        <NavLink to={`/db/admin/my-bookings/${userInfo.userID}`} className={styles.burger_item}>Mes réservations</NavLink>
                        <hr/>
                        <NavLink to={"/db/admin/bookings"} className={styles.burger_item}>Réservations</NavLink>
                        <NavLink to={"/db/admin/destinations"} className={styles.burger_item}>Destinations</NavLink>
                        <NavLink to={"/db/admin/lodgings"} className={styles.burger_item}>Hébérgements</NavLink>
                        <NavLink to={"/db/admin/packs"} className={styles.burger_item}>Packs</NavLink>
                        <NavLink to={"/db/admin/activities"} className={styles.burger_item}>Activités</NavLink>
                        <NavLink to={"/db/admin/users"} className={styles.burger_item}>Clients</NavLink>
                    </>}
                    
                    <NavLink to={"/user/signout"} className={styles.burger_item_signout} onClick={() => toggleBurgerOrLogin()}>déconnexion</NavLink>
                </div>
                : null
            }
            
            {/* ---------- LE BOUTON BURGER ------------ */}
            <button onClick={toggleBurgerOrLogin} 
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    className={`${styles.burger_btn} ${burgerOpen ? styles.hide : styles.show}`} 
                    title="Espace utilisateur">

                {(isHovering && (!userInfo.isLogged && !TOKEN)) && 
                <span className={styles.burger_btn_text}>
                    CONNEXION&nbsp;
                </span>}
                <FontAwesomeIcon icon={faUser} className={styles.burger_icon}/>
            </button>

        </div>
    )
}

export default Burger;