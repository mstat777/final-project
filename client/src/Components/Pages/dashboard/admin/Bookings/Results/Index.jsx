import styles from '../../results.module.scss';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { trimDate, formatDate } from '../../../../../Functions/utils';

function AdminDashBookingResults(){
    const { resultsBookings } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        setShowResults(false);
    },[])

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        resultsBookings.length && setShowResults(true);
    },[resultsBookings.length])

    return (showResults && resultsBookings[0]) &&
            <section className={styles.admin_db_section}>
                    <h2>Résultats</h2>
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
                            </tr>
                        </thead>
                        <tbody>
                        {resultsBookings.map((el, i) => 
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{el.p.reference}</td> 
                                <td>{el.d.name}</td> 
                                <td>{el.d.country}</td> 
                                <td>{formatDate(el.p.departure_date)}</td>
                                <td>{formatDate(el.p.return_date)}</td>
                                <td>{el.p.duration+1}J/{el.p.duration}N</td>  
                                <td>{el.b.price_total_booking} &euro;</td> 
                                <td>{el.u.last_name}</td> 
                                <td>{el.u.first_name}</td> 
                                <td>{el.u.tel}</td> 
                                <td>{el.u.email}</td> 
                                <td>{el.b.status}</td> 
                                <td>{trimDate(el.b.date_created)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table> 
            </section>
}

export default AdminDashBookingResults;