import styles from '../admindash.module.css';

import AdminDashLodgingSearch from './Search/Index';
import AdminDashLodgingResults from './Results/Index';

function AdminDashLodgings(){

    return <main className={styles.admin_db_main}>
                <h2>Hébergements</h2>
                <div>Créer un nouvel hébergement : 
                    <button type="button">créer</button>
                </div>
                <AdminDashLodgingSearch/>
                <AdminDashLodgingResults/>
            </main>
}

export default AdminDashLodgings;