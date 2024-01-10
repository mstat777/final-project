import styles from '../../results.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashLodgingResults(){
    const { resultsLodgings } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        resultsLodgings.length && setShowResults(true);
    },[resultsLodgings.length])

    return (showResults && resultsLodgings[0]) &&
            <section className={styles.admin_db_section}>
                <h2>Résultats</h2>
                <table className={styles.results_table}>
                    <thead>
                        <tr> 
                            <th>N&deg;</th> 
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Modifier</th>
                        </tr>
                    </thead>
                    <tbody>  
                    { resultsLodgings.map((el, i) => 
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td><b>{el.l.name}</b></td>
                            <td>{el.l.type}</td>
                            <td className={styles.justify}>{el.l.overview}</td>
                            <td>
                                <Link to={`/db/admin/lodgings/modify/${i}`}>
                                    <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                                </Link>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
}

export default AdminDashLodgingResults;