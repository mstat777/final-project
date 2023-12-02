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
                    <div className={styles.admin_db_image_ctn}>
                        <FontAwesomeIcon icon={faUser} className={styles.admin_db_image}/>
                    </div>
                    {console.log(userInfo.email)} 
                    <div className={styles.admin_db_dropdown_ctn}>
                        <span className={styles.admin_db_email}>{userInfo.email}</span>
                        <NavLink to={"/db/admin/my-infos"} className={styles.link}>Info personnelles</NavLink>
                        <NavLink to={`/db/admin/my-bookings/${userInfo.userID}`} className={styles.link}>Mes réservations</NavLink>
                        <NavLink to={"/user/signout"} className={styles.link_signout}>déconnexion</NavLink>
                        <NavLink to={"/"} className={styles.link_home}>Accueil</NavLink>
                    </div>   
                </div>
    
                <div className={styles.admin_db_dropdown}>  
                    <NavLink to={"/db/admin/bookings"} className={styles.link}>Réservations</NavLink>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/bookings/search"} className={styles.link}>Trouver réservation</NavLink>
                        <NavLink to={"/db/admin/bookings/create"} className={styles.link}>Créer réservation</NavLink>
                    </div>
                </div>

                <div className={styles.admin_db_dropdown}> 
                    <NavLink to={"/db/admin/destinations"} className={styles.link}>Destinations</NavLink>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/destinations/search"} className={styles.link}>Trouver destination</NavLink>
                        <NavLink to={"/db/admin/destinations/create"} className={styles.link}>Créer destination</NavLink>
                        <NavLink to={"/db/admin/destinations/delete"} className={styles.link}>Supprimer destination</NavLink>
                    </div>
                </div>

                <div className={styles.admin_db_dropdown}> 
                    <NavLink to={"/db/admin/lodgings"} className={styles.link}>Hébérgements</NavLink>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/lodgings/search"} className={styles.link}>Trouver hébérgement</NavLink>
                        <NavLink to={"/db/admin/lodgings/create"} className={styles.link}>Créer hébérgement</NavLink>
                    </div>
                </div>

                <div className={styles.admin_db_dropdown}> 
                    <NavLink to={"/db/admin/packs"} className={styles.link}>Packs</NavLink>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/packs/search"} className={styles.link}>Trouver pack</NavLink>
                        <NavLink to={"/db/admin/packs/create"} className={styles.link}>Créer pack</NavLink>
                    </div>
                </div>

                <div className={styles.admin_db_dropdown}> 
                    <NavLink to={"/db/admin/activities"} className={styles.link}>Activités</NavLink>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/activities/search"} className={styles.link}>Trouver activité</NavLink>
                        <NavLink to={"/db/admin/activities/create"} className={styles.link}>Créer activité</NavLink>
                    </div>
                </div>

                <div className={styles.admin_db_dropdown}> 
                    <NavLink to={"/db/admin/users"} className={styles.link}>Clients</NavLink>
                    <div className={styles.admin_db_dropdown_ctn}>
                        <NavLink to={"/db/admin/users/search"} className={styles.link}>Trouver client</NavLink>
                        <NavLink to={"/db/admin/users/create"} className={styles.link}>Créer compte</NavLink>
                    </div>
                </div>

                {(userInfo.accountType === "superadmin") && 
                    <NavLink to={"/db/admin/new-offer"} className={styles.link}>Créer offre</NavLink>
                }
            </nav>
        </header>
    )
}

export default AdminDashboardHeader;