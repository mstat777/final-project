import styles from '../dashboard.module.css';

import Search from '../../../Containers/dashboard/Search/Index';
import DashboardResults from '../../../Containers/dashboard/Results/Index';

function AdminDashboardBookingsCreate(){

    return <main className={styles.user_db_main}>
                <Search/>
                <DashboardResults/>
            </main>
}

export default AdminDashboardBookingsCreate;