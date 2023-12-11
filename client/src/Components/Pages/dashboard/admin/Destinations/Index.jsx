import styles from '../admindash.module.css';

import AdminDashDestinationSearch from './Search/Index';
import AdminDashDestinationResults from './Results/Index';

function AdminDashDestinations(){

    return <main className={styles.admin_db_main}>
                <h2>destinations</h2>
                <div>Créer une nouvelle destination: 
                    <button type="button">créer</button>
                </div>
                <AdminDashDestinationSearch/>
                <AdminDashDestinationResults/>
            </main>
}

export default AdminDashDestinations;