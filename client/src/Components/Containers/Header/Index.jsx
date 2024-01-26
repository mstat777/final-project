import styles from './Header.module.scss';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import logo from '../../../assets/img/logo-dimitravel-02.png';
import Burger from '../buttons/Burger/Index';
 
function Header() {
    const isMobile = useMediaQuery({query: '(max-width: 767px)'});

    return <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.nav_outer}>
                        <NavLink to={"/"} 
                            onClick={() => window.scrollTo(0, 0)}
                            className={styles.nav_logo_ctn}>
                            <img src={logo} alt="Logo de l'agence Dimitravel"/>
                        </NavLink>
                    
                        <Burger/>
                    </div>
                    {!isMobile &&
                    <ul className={styles.nav_inner}>
                        <li><NavLink to={"/holidays"}>séjours</NavLink></li>
                        <li><NavLink to={"/agency"}>agence</NavLink></li>
                        <li><NavLink to={"/contact"}>contact</NavLink></li>
                    </ul>}
                </nav>
            </header>
}

export default Header;