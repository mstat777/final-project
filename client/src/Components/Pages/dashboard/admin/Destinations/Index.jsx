import styles from '../admindash.module.scss';
import { Link, useLocation } from 'react-router-dom';
import AdminDashDestinationSearch from './Search/Index';
import AdminDashDestinationResults from './Results/Index';
import AdminDashDesinationsCreateModify from './CreateModify/Index';

function AdminDashDestinations(){
    const {pathname} = useLocation();

    return <main className={styles.admin_db_main}>
                { pathname === "/db/admin/destinations" && 
                <>
                    <h1>Destinations</h1>
                    <section>
                        <p>Créer une nouvelle destination : 
                            <Link to={`/db/admin/destinations/create`}className={styles.admin_db_link}>créer</Link>
                        </p>
                    </section>
                    <AdminDashDestinationSearch/>
                    <AdminDashDestinationResults/>
                </> }

                { (pathname.includes("create") || pathname.includes("modify")) && 
                    <AdminDashDesinationsCreateModify/>}
            </main>
}

export default AdminDashDestinations;