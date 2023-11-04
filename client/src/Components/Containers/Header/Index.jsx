import { NavLink } from 'react-router-dom';

import styles from './header.module.css';
import logo from '../../../assets/img/logo-dimitravel-02-90p45p.png';
import Burger from '../Burger/Index';
 
function Header() {

    return (
        <header>
            <nav>
                <div className={styles.nav_upper}>
                    <NavLink to={"/"} className={styles.nav_logo}>
                        <img src={logo} alt=""/>
                    </NavLink>
                
                    <Burger/>
                </div>

                <NavLink to={"/holidays"}>séjours</NavLink>
                <NavLink to={"/agency"}>agence</NavLink>
                <NavLink to={"/contact"}>contact</NavLink>

            </nav>
        </header>
    )
}

export default Header;