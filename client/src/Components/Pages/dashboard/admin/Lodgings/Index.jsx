import styles from '../admindash.module.css';

import AdminDashLodgingSearch from './Search/Index';
import AdminDashLodgingResults from './Results/Index';

function AdminDashLodgings(){

    return <main className={styles.admin_db_main}>
                <h2>Hébérgements</h2>
                <AdminDashLodgingSearch/>
                <AdminDashLodgingResults/>
            </main>
}

export default AdminDashLodgings;