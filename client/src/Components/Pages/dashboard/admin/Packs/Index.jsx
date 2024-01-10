import styles from '../admindash.module.scss';
import { Link, useLocation } from 'react-router-dom';
import AdminDashPacksSearch from './Search/Index';
import AdminDashPacksResults from './Results/Index';
import AdminDashPackCreateModify from './CreateModify/Index';

function AdminDashPacks(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                { pathname === "/db/admin/packs" && 
                    <>
                        <h1>Packs</h1>
                        <section>
                            <p>Créer un nouveau pack : 
                                <Link to={`/db/admin/packs/create`}className={styles.admin_db_link}>créer</Link>
                            </p>
                        </section>
                        <AdminDashPacksSearch/>
                        <AdminDashPacksResults/>
                    </>}

                { (pathname.includes("create") || pathname.includes("modify")) && 
                    <AdminDashPackCreateModify/>}
            </main>
}

export default AdminDashPacks;