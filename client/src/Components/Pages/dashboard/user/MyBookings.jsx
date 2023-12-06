import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function UserDashboardMyBookings(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { userInfo } = useSelector(state => state.user);

    const [ userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        // on récupère les données des réservations effectuées par l'utilisateur :
        async function fetchBookings() {
            try {
                const dataBookings = await (await fetch(`${BASE_URL}/api/v.0.1/user/mybookings/${userInfo.userID}`)).json();
                setUserBookings(dataBookings.datas);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBookings();
    }, []);

    return(
        <main className={styles.user_db_main}>
            <div className={styles.user_db_section}>

                <h2>mes réservations</h2>

                <table className={styles.booking_table}>
                    <thead>
                        <tr> 
                            <th>N&deg;</th> 
                            <th>date</th>
                            <th>destination</th>
                            <th>Nb d'adultes</th>
                            <th>Nb d'enfants</th>
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
                                <td>{booking.b.nb_adults}</td>
                                <td>{booking.b.nb_children}</td>
                                <td>{booking.b.price_total_booking} &euro;</td>
                                <td>
                                    <button>modifier</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </main>
    )
}

export default UserDashboardMyBookings;