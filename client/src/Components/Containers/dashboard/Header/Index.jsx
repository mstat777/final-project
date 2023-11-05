import styles from './header.module.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function UserDashboardHeader(){

    const { userInfo } = useSelector(state => state.user);

    return(
        <header className={styles.user_db_header}>
            <div><p>Mon profil</p></div>
            <nav className={styles.user_db_nav}>
                <div className={styles.user_db_image_ctn}>
                    <FontAwesomeIcon icon={faUser} className={styles.user_db_image}/>
                </div>
                <span>{userInfo.email}</span>
                <NavLink to={"/dashboard/user/infos"} className={styles.link}>Info personnelles</NavLink>
                <NavLink to={"/dashboard/user/bookings"} className={styles.link}>Mes réservations</NavLink>

                <NavLink to={"/"} className={styles.link_home}>Accueil</NavLink>
            </nav>
        </header>
    )
}

export default UserDashboardHeader;