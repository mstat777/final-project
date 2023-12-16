import { NavLink } from 'react-router-dom';

import styles from './header.module.css';
import logo from '../../../assets/img/logo-dimitravel-02-90p45p.png';
import Burger from '../buttons/Burger/Index';
 
function Header() {

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.nav_upper}>
                    <NavLink to={"/"} 
                        onClick={() => window.scrollTo(0, 0)}
                        className={styles.nav_logo_ctn}>
                        <img src={logo} alt=""/>
                    </NavLink>
                
                    <Burger/>
                </div>
                <div className={styles.nav_lower}>
                    <NavLink to={"/holidays"}>séjours</NavLink>
                    <NavLink to={"/agency"}>agence</NavLink>
                    <NavLink to={"/contact"}>contact</NavLink>
                </div>
            </nav>
        </header>
    )
}

export default Header;