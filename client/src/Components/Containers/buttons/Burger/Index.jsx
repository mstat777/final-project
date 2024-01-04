import styles from './Burger.module.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getTokenData } from '../../../Functions/getTokenData';

function Burger() {
    const SK = process.env.REACT_APP_SK;
    const TOKEN = localStorage.getItem("auth");

    const navigate = useNavigate();
    const isMobile = useMediaQuery({query: '(max-width: 767px)'});

    const { userInfo } = useSelector(state => state.user);

    const [burgerOpen, setBurgerOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // si l'utilisateur est authentifié, mais par ex. a rafraichi la page, on vérifie le token et si valide, on récupère ses identifiants :
    useEffect(() => {
        if (!userInfo.isLogged && TOKEN) {
            getTokenData();
        }
    },[userInfo.isLogged])

    const toggleBurgerOrLogin = () => {
        if (!isMobile && !userInfo.isLogged && !TOKEN) {
            navigate("/user/signin");
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

    return <nav className={`${styles.burger_menu} ${burgerOpen ? styles.show_burger_menu : styles.hide_burger_menu }`}>

            {/* ---------- le containeur des liens ------------ */}
            <div className={styles.burger_items_ctn}>
                <button onClick={toggleBurgerOrLogin} className={styles.burger_cross_btn}>
                    <FontAwesomeIcon icon={faXmark} className={styles.burger_cross}/>
                </button>

                {/* uniquement si logué : */}
                {((userInfo.isLogged || TOKEN) && userInfo.userID) && 
                <>
                    <FontAwesomeIcon icon={faUser} className={styles.user_icon}/>

                    <p className={styles.small_txt}>
                        Espace {userInfo.accountType === "admin" || userInfo.accountType === "superadmin" ? "admin": "client"}
                    </p>
                    <p className={styles.user_txt}>{userInfo.email}</p>
                    <hr/>
                    
                    {(userInfo.accountType === "client") && 
                    <div>
                        <NavLink to={"/db/user/my-infos"}>Mes infos</NavLink>
                        <NavLink to={`/db/user/my-bookings/${userInfo.userID}`}>Mes réservations</NavLink>
                    </div>}

                    {(userInfo.accountType === "admin" || userInfo.accountType === "superadmin") && 
                    <div>
                        <NavLink to={"/db/admin/my-infos"}>Mes infos</NavLink>
                        <NavLink to={`/db/admin/my-bookings/${userInfo.userID}`}>Mes réservations</NavLink>
                        <hr/>
                        <NavLink to={"/db/admin/bookings"}>Réservations</NavLink>
                        <NavLink to={"/db/admin/destinations"}>Destinations</NavLink>
                        <NavLink to={"/db/admin/lodgings"}>Hébergements</NavLink>
                        <NavLink to={"/db/admin/packs"}>Packs</NavLink>
                        <NavLink to={"/db/admin/activities"}>Activités</NavLink>
                        <NavLink to={"/db/admin/users"}>Clients</NavLink>
                    </div>}
                </>}   

                {isMobile &&
                <div className={styles.main_links_ctn}>
                    <NavLink to={"/holidays"}>séjours</NavLink>
                    <NavLink to={"/agency"}>agence</NavLink>
                    <NavLink to={"/contact"}>contact</NavLink>

                    {(userInfo.isLogged || TOKEN) ?
                    <NavLink to={"/user/signout"} className={styles.sign} onClick={() => toggleBurgerOrLogin()}>déconnexion</NavLink> : 
                    <NavLink to={"/user/signin"} className={styles.sign} onClick={() => toggleBurgerOrLogin()}>connexion</NavLink>
                    }
                </div>}
            </div>
            
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
        </nav>
}

export default Burger;