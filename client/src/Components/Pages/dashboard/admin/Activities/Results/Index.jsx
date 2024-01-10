import styles from '../../results.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashActivitiesResults(){
    const { resultsActivities } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        resultsActivities.length && setShowResults(true);
    },[resultsActivities.length])

    return (showResults && resultsActivities[0]) &&
        <section className={styles.admin_db_section}>
            <h2>Résultats</h2>
            <table className={styles.results_table}>
                <thead>
                    <tr>
                        <th>N&deg;</th> 
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Prix/adulte</th>
                        <th>Prix/enfant</th>
                        <th>Places totales</th>
                        <th>Places restantes</th>
                        <th>Modifier</th>
                    </tr>
                </thead>
                <tbody>
                {resultsActivities.map((result, i) => 
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td><b>{result.a.name}</b></td> 
                        <td>{result.a.type}</td> 
                        <td>{result.a.overview}</td>            
                        <td>{result.a.price_adults}</td> 
                        <td>{result.a.price_children}</td> 
                        <td>{result.a.places_total}</td>       
                        <td>{result.a.places_left}</td>               
                        <td>
                            <Link to={`/db/admin/activities/modify/${i}`}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </table> 
        </section>
}

export default AdminDashActivitiesResults;