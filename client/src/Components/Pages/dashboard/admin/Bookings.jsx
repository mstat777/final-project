import styles from '../dashboard.module.css';

import Search from '../../../Containers/dashboard/Search/Index';
import DashboardResults from '../../../Containers/dashboard/Results/Index';

function AdminDashboardBookings(){

    return <main className={styles.user_db_main}>
                <h2>Trouver une réservation</h2>
                <Search/>
                <DashboardResults/>
            </main>
}

export default AdminDashboardBookings;