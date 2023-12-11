import styles from '../admindash.module.css';

import AdminDashBookingsSearch from './Search/Index';
import AdminDashBookingsResults from './Results/Index';

function AdminDashBookings(){

    return <main className={styles.admin_db_main}>
                <h2>Réservations</h2>
                <AdminDashBookingsSearch/>
                <AdminDashBookingsResults/>
            </main>
}

export default AdminDashBookings;