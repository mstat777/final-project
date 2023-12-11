import styles from './adminheader.module.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function AdminDashboardHeader(){
    const { userInfo } = useSelector(state => state.user);

    return(
        <header className={styles.admin_db_header}>

            <nav className={styles.admin_db_nav}>

                <div className={styles.admin_db_dropdown}>
                    <div className={styles.admin_db_user_ctn}>
                        <div className={styles.admin_db_image_ctn}>
                            <FontAwesomeIcon icon={faUser} className={styles.admin_db_image}/>
                        </div>
                        <span className={styles.admin_db_email}>{userInfo.email}</span>
                    </div>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/my-infos"} className={styles.link}>Mes informations</NavLink>
                        <NavLink to={`/db/admin/my-bookings/${userInfo.userID}`} className={styles.link}>Mes réservations</NavLink>
                        <NavLink to={"/user/signout"} className={styles.link_signout}>déconnexion</NavLink>
                        <NavLink to={"/"} className={styles.link_home}>Accueil</NavLink>
                    </div>   
                </div>
    
                <div className={styles.admin_db_links_ctn}>
                    <NavLink to={"/db/admin/bookings"} className={styles.link}>Réservations</NavLink>
                    <NavLink to={"/db/admin/destinations"} className={styles.link}>Destinations</NavLink>
                    <NavLink to={"/db/admin/lodgings"} className={styles.link}>Hébérgements</NavLink>
                    <NavLink to={"/db/admin/packs"} className={styles.link}>Packs</NavLink>
                    <NavLink to={"/db/admin/activities"} className={styles.link}>Activités</NavLink>
                    <NavLink to={"/db/admin/users"} className={styles.link}>Clients</NavLink>
                </div>

                {(userInfo.accountType === "superadmin") && 
                    <NavLink to={"/db/admin/new-offer"} className={styles.link}>Créer offre</NavLink>
                }
            </nav>
        </header>
    )
}

export default AdminDashboardHeader;