import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import styles from './header.module.css';
import logo from '../../../assets/img/logo-dimitravel-02-90p45p.png';
 
function Header() {

    const { userInfo } = useSelector(state => state.user);
    return (
        <header>
            <nav>
                <div className={styles.nav_upper}>
                    <NavLink to={"/"}>
                        <img src={logo} alt=""/>
                    </NavLink>
                    
                    {!userInfo.isLogged ? (
                        <NavLink to={"/user/signin"} 
                        title="vers le formulaire de connexion" 
                        className={styles.nav_upper_button}>connexion</NavLink>
                    ) : (
                        <>
                            <NavLink
                                to={"/user/dashboard"}
                                title="aller à votre espace personnel"
                            >
                                {userInfo.email}
                            </NavLink>
                            <NavLink
                                to={"/user/signout"}
                                title="Se déconnecter"
                            >
                                déconnexion
                            </NavLink>
                        </>
                    )}
                </div>
                <NavLink to={"/holidays"}>séjours</NavLink>
                <NavLink to={"/agency"}>agence</NavLink>
                <NavLink to={"/contact"}>contact</NavLink>
            </nav>
        </header>
    )
}

export default Header;