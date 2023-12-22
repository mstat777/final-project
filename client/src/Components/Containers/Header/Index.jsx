import { NavLink } from 'react-router-dom';

import styles from './header.module.css';
import logo from '../../../assets/img/logo-dimitravel-02-90p45p.png';
import Burger from '../buttons/Burger/Index';
 
function Header() {

    return <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.nav_upper}>
                        <NavLink to={"/"} 
                            onClick={() => window.scrollTo(0, 0)}
                            className={styles.nav_logo_ctn}>
                            <img src={logo} alt="Logo de l'agence Dimitravel"/>
                        </NavLink>
                    
                        <Burger/>
                    </div>
                    <ul className={styles.nav_lower}>
                        <li><NavLink to={"/holidays"}>séjours</NavLink></li>
                        <li><NavLink to={"/agency"}>agence</NavLink></li>
                        <li><NavLink to={"/contact"}>contact</NavLink></li>
                    </ul>
                </nav>
            </header>
}

export default Header;