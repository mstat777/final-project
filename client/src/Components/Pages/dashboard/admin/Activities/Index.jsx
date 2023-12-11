import styles from '../admindash.module.css';

import AdminDashActivitiesSearch from './Search/Index';
import AdminDashActivitiesResults from './Results/Index';

function AdminDashActivities(){

    return <main className={styles.admin_db_main}>
                <h2>Activités</h2>
                <AdminDashActivitiesSearch/>
                <AdminDashActivitiesResults/>
            </main>
}

export default AdminDashActivities;