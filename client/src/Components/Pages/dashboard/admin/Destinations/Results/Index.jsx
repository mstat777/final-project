import styles from '../../results.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashDestinationResults(){
    const { resultsDestinations } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        resultsDestinations.length && setShowResults(true);
    },[resultsDestinations.length])

    return (showResults && resultsDestinations[0]) &&
        <section className={styles.admin_db_section}>
            <h2>Résultats</h2>
            <table className={styles.results_table}>
                <thead>
                    <tr> 
                        <th>N&deg;</th> 
                        <th>référence</th>
                        <th>destination</th>
                        <th>pays</th>
                        <th>continent</th>
                        <th>description</th>
                        <th>point(s) de départ</th>
                        <th>date</th>
                        <th>modifier</th>
                    </tr>
                </thead>
                <tbody>  
                { resultsDestinations.map((el, i) => 
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{el.d.reference}</td>
                        <td><b>{el.d.name}</b></td>
                        <td>{el.d.country}</td>
                        <td>{el.d.continent}</td>
                        <td>{el.d.overview}</td>
                        <td>{el.d.departure_place}</td>
                        <td>{el.d.date_created.slice(0, el.d.date_created.indexOf('T'))}</td>
                        <td>
                            <Link to={`/db/admin/destinations/modify/${i}`}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </section>
}

export default AdminDashDestinationResults;