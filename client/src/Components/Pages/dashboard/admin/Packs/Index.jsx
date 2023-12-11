import styles from '../admindash.module.css';

import AdminDashPacksSearch from './Search/Index';
import AdminDashPacksResults from './Results/Index';

function AdminDashPacks(){

    return <main className={styles.admin_db_main}>
                <h2>Packs</h2>
                <AdminDashPacksSearch/>
                <AdminDashPacksResults/>
            </main>
}

export default AdminDashPacks;