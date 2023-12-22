import styles from '../admindash.module.css';
import { Link, useLocation } from 'react-router-dom';

import AdminDashDestinationSearch from './Search/Index';
import AdminDashDestinationResults from './Results/Index';
import AdminDashDesinationsCreate from './Create/Index';
import AdminDashDesinationsModify from './Modify/Index';

function AdminDashDestinations(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                <h2>destinations</h2>
                { pathname === "/db/admin/destinations" && 
                <>
                    <div>Créer une nouvelle destination : 
                        <Link to={`/db/admin/destinations/create`}className={styles.admin_db_link}>créer</Link>
                    </div>
                    <AdminDashDestinationSearch/>
                    <AdminDashDestinationResults/>
                </> }
                { pathname.includes("create") && 
                    <AdminDashDesinationsCreate/>}
                { pathname.includes("modify") && 
                    <AdminDashDesinationsModify/>}
            </main>
}

export default AdminDashDestinations;