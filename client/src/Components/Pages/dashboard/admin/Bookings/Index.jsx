import styles from '../admindash.module.scss';
import AdminDashBookingsSearch from './Search/Index';
import AdminDashBookingsResults from './Results/Index';

function AdminDashBookings(){
    return <main className={styles.admin_db_main}>
                <h1>Réservations</h1>
                <AdminDashBookingsSearch/>
                <AdminDashBookingsResults/>
            </main>
}

export default AdminDashBookings;