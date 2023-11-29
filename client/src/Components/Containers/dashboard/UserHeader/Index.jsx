import styles from './userheader.module.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function UserDashboardHeader(){
    const { userInfo } = useSelector(state => state.user);

    return(
        <header className={styles.user_db_header}>
            <nav className={styles.user_db_nav}>
                <div className={styles.user_db_image_ctn}>
                    <FontAwesomeIcon icon={faUser} className={styles.user_db_image}/>
                </div>
                <span>{userInfo.email}</span>
                {console.log(userInfo.email)}   
                <NavLink to={"/db/user/my-infos"} className={styles.link}>Info personnelles</NavLink>
                <NavLink to={`/db/user/my-bookings/${userInfo.userID}`} className={styles.link}>Mes réservations</NavLink>

                <NavLink to={"/user/signout"} className={styles.link_signout}>déconnexion</NavLink>

                <NavLink to={"/"} className={styles.link_home}>Accueil</NavLink>
            </nav>
        </header>
    )
}

export default UserDashboardHeader;