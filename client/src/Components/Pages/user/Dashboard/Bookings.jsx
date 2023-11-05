import styles from './dashboard.module.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function UserDashboardBookings(){

    const { userInfo } = useSelector(state => state.user);

    return(
        <main className={styles.user_db_main}>
            <h2>mes réservations</h2>

        </main>
    )
}

export default UserDashboardBookings;