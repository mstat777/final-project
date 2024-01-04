import styles from './UserHeader.module.scss';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function UserDashboardHeader(){
    const { userInfo } = useSelector((state) => state.user);

    return <header className={styles.user_db_header}>
            <nav className={styles.user_db_nav}>
                <div className={styles.user_db_user_ctn}>  
                    <div className={styles.user_db_image_ctn}>
                        <FontAwesomeIcon icon={faUser} className={styles.user_db_image}/>
                    </div>
                    <span>{userInfo.email}</span>
                </div>
  
                <ul className={styles.user_db_links_ctn}>
                    <li><NavLink to={"/db/user/my-infos"} className={styles.link}>Mes informations</NavLink></li>
                    <li><NavLink to={`/db/user/my-bookings/${userInfo.userID}`} className={styles.link}>Mes réservations</NavLink></li>
                    <li><NavLink to={"/user/signout"} className={styles.link_signout}>déconnexion</NavLink></li>
                    <li><NavLink to={"/"} className={styles.link_home}>Accueil</NavLink></li>
                </ul>
            </nav>
        </header>
}

export default UserDashboardHeader;