import styles from '../admindash.module.css';

import AdminDashUsersSearch from './Search/Index';
import AdminDashUsersResults from './Results/Index';

function AdminDashUsers(){

    return <main className={styles.admin_db_main}>
                <h2>Utilisateurs</h2>
                <AdminDashUsersSearch/>
                <AdminDashUsersResults/>
            </main>
}

export default AdminDashUsers;