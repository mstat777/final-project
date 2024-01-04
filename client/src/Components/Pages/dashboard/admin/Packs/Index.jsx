import styles from '../admindash.module.scss';
import { Link, useLocation } from 'react-router-dom';

import AdminDashPacksSearch from './Search/Index';
import AdminDashPacksResults from './Results/Index';
import AdminDashPackCreate from './Create/Index';

function AdminDashPacks(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                <h2>Packs</h2>
                { pathname === "/db/admin/packs" && 
                <>
                    <div>Créer un nouveau pack : 
                        <Link to={`/db/admin/packs/create`}className={styles.admin_db_link}>créer</Link>
                    </div>
                    <AdminDashPacksSearch/>
                    <AdminDashPacksResults/>
                </>}
                { pathname.includes("create") && 
                    <AdminDashPackCreate/>}
                {/* pathname.includes("modify") && 
                    <AdminDashPackModify/>*/}
            </main>
}

export default AdminDashPacks;