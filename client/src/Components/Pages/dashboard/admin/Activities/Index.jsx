import styles from '../admindash.module.scss';
import { Link, useLocation } from 'react-router-dom';
import AdminDashActivitiesSearch from './Search/Index';
import AdminDashActivitiesResults from './Results/Index';
import AdminDashActivitiesCreateModify from './CreateModify/Index';

function AdminDashActivities(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                { pathname === "/db/admin/activities" && 
                    <>
                        <h1>Activités</h1>
                        <section>
                            <p>Créer une nouvelle activité : 
                                <Link to={`/db/admin/activities/create`}className={styles.admin_db_link}>créer</Link>
                            </p>
                        </section>
                        <AdminDashActivitiesSearch/>
                        <AdminDashActivitiesResults/>
                    </>}
                
                { (pathname.includes("create") || pathname.includes("modify")) && 
                    <AdminDashActivitiesCreateModify/>} 
            </main>
}

export default AdminDashActivities;