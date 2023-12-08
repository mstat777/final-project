import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './results.module.css';
import { useState, useEffect } from 'react';

function DashboardResults(){
    const { results } = useSelector((state) => state.dashboard);
    const navigate = useNavigate();

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        if (results.length) {
            setShowResults(true);
        }
    },[results.length])

    return <>
        { console.log(results)}
        { console.log("showResults = "+showResults)}
        { showResults && 
        <>
        {results[0] ? <>
        <h3>Résultats</h3>
        <table className={styles.results_table}>
            <thead>
                <tr>
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
                    <th>Modifier</th>
                </tr>
            </thead>
            <tbody>
            {console.log(results)}
            {results.map((result, index) => 
                <tr key={index}>
                    <td>{result.reference}</td> 
                    <td>{result.name}</td> 
                    <td>{result.country}</td> 
                    <td>{result.departure_date.slice(0, result.departure_date.indexOf('T'))}</td>
                    <td>{result.return_date.slice(0, result.return_date.indexOf('T'))}</td>
                    <td>{result.duration+1}J/{result.duration}N</td>  
                    <td>{result.price_total_booking} &euro;</td> 
                    <td>{result.last_name}</td> 
                    <td>{result.first_name}</td> 
                    <td>{result.tel}</td> 
                    <td>{result.email}</td> 
                    <td>{result.status}</td> 
                    <td>{result.date_created.slice(0, result.date_created.indexOf('T'))}</td>
                    <td>
                        <button 
                        onClick={() => {
                            navigate(`/dashboard/admin/bookings/modify/${result.id}`);
                        }} 
                        className={styles.book_btn}>modifier</button>
                    </td> 
                </tr>
                )}
            </tbody>
        </table> 
        </>
        : <p className={styles.msg_nok}>Aucun résultat trouvé</p>
        }
        </>}
    </>
}

export default DashboardResults;