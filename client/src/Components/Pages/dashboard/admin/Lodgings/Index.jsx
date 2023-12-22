import styles from '../admindash.module.css';
import { Link, useLocation } from 'react-router-dom';

import AdminDashLodgingSearch from './Search/Index';
import AdminDashLodgingResults from './Results/Index';
import AdminDashLodgingCreate from './Create/Index';
import AdminDashLodgingModify from './Modify/Index';

function AdminDashLodgings(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                <h2>Hébergements</h2>
                { pathname === "/db/admin/lodgings" && 
                <>
                    <div>Créer un nouvel hébergement : 
                        <Link to={`/db/admin/lodgings/create`}className={styles.admin_db_link}>créer</Link>
                    </div>
                    <AdminDashLodgingSearch/>
                    <AdminDashLodgingResults/>
                </>}
                { pathname.includes("create") && 
                    <AdminDashLodgingCreate/>}
                { pathname.includes("modify") && 
                    <AdminDashLodgingModify/>}
            </main>
}

export default AdminDashLodgings;