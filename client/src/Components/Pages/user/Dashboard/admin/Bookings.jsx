import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Search from '../../../../Containers/dashboard/Search/Index';
import DashboardResults from '../../../../Containers/dashboard/Results/Index';

function AdminDashboardBookings(){
    const { results } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (results[0]) {
            console.log(results);
            setShowResults(true);
        }
    },[results])

    return(
        <main className={styles.user_db_main}>

            <Search/>
            {console.log("showResults = "+showResults)}
            {console.log(results)}
            {showResults && <>
                {console.log("showResults = "+showResults)}
                <DashboardResults/>
            </>}

        </main>
    )
}

export default AdminDashboardBookings;