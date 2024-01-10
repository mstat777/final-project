import styles from '../admindash.module.scss';
import AdminDashUsersSearch from './Search/Index';
import AdminDashUsersResults from './Results/Index';

function AdminDashUsers(){
    return <main className={styles.admin_db_main}>
                <h1>Utilisateurs</h1>
                <AdminDashUsersSearch/>
                <AdminDashUsersResults/>
            </main>
}

export default AdminDashUsers;