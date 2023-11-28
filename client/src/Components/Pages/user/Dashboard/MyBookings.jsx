import styles from './dashboard.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function UserDashboardBookings(){

    const { userInfo } = useSelector(state => state.user);

    const [ userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        // on récupère les données des réservations effectuées par l'utilisateur :
        async function fetchBookings() {
            try {
                const dataBookings = await (await fetch(`/api/v.0.1/user/mybookings/${userInfo.userID}`)).json();
                setUserBookings(dataBookings.datas);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBookings();
    }, []);

    return(
        <main className={styles.user_db_main}>
            <h2>mes réservations</h2>

            <table className={styles.booking_table}>
                <thead>
                    <tr> 
                        <th>N&deg;</th> 
                        <th>date</th>
                        <th>destination</th>
                        <th>prix total</th>
                        <th>modifier</th>
                    </tr>
                </thead>
                <tbody>  
                    { console.log(userBookings)}
                    { userBookings.map((booking, index) => 
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{booking.b.date_created.slice(0, booking.b.date_created.indexOf('T'))}</td>
                            <td>{booking.d.name}</td>
                            <td>{booking.b.price_total_booking} &euro;</td>
                            <td>
                                <button>modifier</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </main>
    )
}

export default UserDashboardBookings;