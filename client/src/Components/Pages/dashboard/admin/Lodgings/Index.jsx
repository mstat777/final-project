import styles from '../admindash.module.scss';
import { Link, useLocation } from 'react-router-dom';
import AdminDashLodgingSearch from './Search/Index';
import AdminDashLodgingResults from './Results/Index';
import AdminDashLodgingCreateModify from './CreateModify/Index';

function AdminDashLodgings(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                { pathname === "/db/admin/lodgings" && 
                    <>
                        <h1>Hébergements</h1>
                        <section>
                            <p>Créer un nouvel hébergement : 
                                <Link to={`/db/admin/lodgings/create`}className={styles.admin_db_link}>créer</Link>
                            </p>
                        </section>
                        <AdminDashLodgingSearch/>
                        <AdminDashLodgingResults/>
                    </>}
                    
                { (pathname.includes("create") || pathname.includes("modify")) && 
                    <AdminDashLodgingCreateModify/>}
            </main>
}

export default AdminDashLodgings;