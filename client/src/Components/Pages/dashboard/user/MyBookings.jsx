import styles from './userdash.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function UserDashboardMyBookings(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { userInfo } = useSelector(state => state.user);

    const [ userBookings, setUserBookings] = useState([]);

    // pour afficher des messages suite à la suppression :
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        // on récupère les données de toutes les réservations effectuées par l'utilisateur :
        async function fetchBookings() {
            try {
                const dataBookings = await (await fetch(`${BASE_URL}/api/v.0.1/user/mybookings/${userInfo.userID}`)).json();
                setUserBookings(dataBookings.datas);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBookings();
    }, [userBookings.length]);

    // supprimer une des réservations de l'utilisateur :
    function handleModify(id) {
        
    }

    // supprimer une des réservations de l'utilisateur :
    async function handleDelete(id, index) {
        const shouldRemove = window.confirm("Êtez-vous sûr ?");
        if (shouldRemove) {
            console.log("User booking delete query sent!");
            const res = await fetch(`${BASE_URL}/api/v.0.1/user/booking/delete`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const json = await res.json();
            //console.log(json.msg);  
            if (res.status === 201) {
                setOkMsg("La réservation a été supprimée.");
                // on supprime l'élément du tableau :
                userBookings.splice(index, 1);
                //navigate("/db/admin/lodgings");
            }
        }
    }

    return(
        <main className={styles.user_db_main}>
            <div className={styles.user_db_section}>

                <h2>mes réservations</h2>

                {userBookings[0] ? 
                <>  
                <table className={styles.booking_table}>
                    <thead>
                        <tr> 
                            <th>N&deg;</th> 
                            <th>date</th>
                            <th>destination</th>
                            <th>adultes</th>
                            <th>enfants</th>
                            <th>prix total</th>
                            <th>modifier</th>
                            <th>supprimer</th>
                        </tr>
                    </thead>
                    <tbody>  
                    {/* console.log(userBookings)*/}
                    { userBookings.map((booking, index) => 
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{new Date(booking.b.date_created).toLocaleString().slice(0, -3)}</td>
                            <td>{booking.d.name}</td>
                            <td>{booking.b.nb_adults}</td>
                            <td>{booking.b.nb_children}</td>
                            <td>{booking.b.price_total_booking} &euro;</td>
                            <td>
                                <button type="button"
                                    onClick={() => handleModify(booking.b.id)}>
                                    <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                                </button>
                            </td>
                            <td>
                                <button type="button"
                                    onClick={() => handleDelete(booking.b.id, index)}>
                                    <FontAwesomeIcon icon={faTrashCan} className={styles.delete_icon}/>
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
                { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

                </>
                : <p className={styles.msg_nok}>Aucun réservation trouvée</p>
                }
            </div>
        </main>
    )
}

export default UserDashboardMyBookings;