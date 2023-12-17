import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../results.module.css';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function AdminDashBookingResults(){
    const navigate = useNavigate();

    const { resultsActivities } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        if (resultsActivities.length) {
            setShowResults(true);
        }
    },[resultsActivities.length])

    return <>
        { console.log(resultsActivities)}
        { console.log("showResults = "+showResults)}
        { showResults && 
        <div className={styles.admin_db_section}>
        {resultsActivities[0] ? 
        <>
            <h3>Résultats</h3>
            <table className={styles.results_table}>
                <thead>
                    <tr>
                        <th>N&deg;</th> 
                        <th>Réf. pack &#35;</th>
                        <th>Destination</th>
                        <th>Pays</th>
                        <th>Date départ</th>
                        <th>Date retour</th>
                        <th>Durée</th>
                        <th>Montant total</th>
                        <th>Nom client</th>
                        <th>Prénom client</th>
                        <th>Tél. client</th>
                        <th>Mail client</th>
                        <th>Statut</th>
                        <th>Date réservation</th>
                        <th>modif.</th>
                        <th>suppr.</th>
                    </tr>
                </thead>

                <tbody>
                {console.log(resultsActivities)}
                {resultsActivities.map((result, index) => 
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{result.p.reference}</td> 
                        <td>{result.d.name}</td> 
                        <td>{result.d.country}</td> 
                        <td>{result.p.departure_date.slice(0, result.p.departure_date.indexOf('T'))}</td>
                        <td>{result.p.return_date.slice(0, result.p.return_date.indexOf('T'))}</td>
                        <td>{result.p.duration+1}J/{result.p.duration}N</td>  
                        <td>{result.b.price_total_booking} &euro;</td> 
                        <td>{result.u.last_name}</td> 
                        <td>{result.u.first_name}</td> 
                        <td>{result.u.tel}</td> 
                        <td>{result.u.email}</td> 
                        <td>{result.b.status}</td> 
                        <td>{result.b.date_created.slice(0, result.b.date_created.indexOf('T'))}</td>
                        <td>
                            <button type="button" 
                                    onClick={() => {
                                        navigate(`/dashboard/admin/bookings/modify/${result.id}`);
                                    }} 
                                    className={styles.book_btn}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </button>
                        </td> 
                        <td>
                            <button type="button" 
                                    onClick={() => {
                                        navigate(`/dashboard/admin/bookings/delete/${result.id}`);
                                    }} 
                                    className={styles.book_btn}>
                                <FontAwesomeIcon icon={faTrashCan} className={styles.delete_icon}/>
                            </button>
                        </td> 

                    </tr>
                    )}

                </tbody>
            </table> 
        </>
        : <p className={styles.msg_nok}>Aucun résultat trouvé</p>
        }
        </div>}
    </>
}

export default AdminDashBookingResults;