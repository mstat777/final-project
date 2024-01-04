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

    // ne pas afficher de résultats au début:
    useEffect(() => {
        setShowResults(false);
    },[])

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        if (resultsLodgings.length) {
            setShowResults(true);
        }
    },[resultsLodgings.length])

    return showResults && 
            <section className={styles.admin_db_section}>
                {resultsLodgings[0] ? 
                <>
                    <h2>Résultats</h2>
                    <table className={styles.results_table}>
                        <thead>
                            <tr> 
                                <th>N&deg;</th> 
                                <th>nom</th>
                                <th>type</th>
                                <th>description</th>
                                <th>modifier</th>
                            </tr>
                        </thead>

                        <tbody>  
                        { resultsLodgings.map((el, i) => 
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{el.l.name}</td>
                                <td>{el.l.type}</td>
                                <td>{el.l.overview}</td>
                                <td>
                                    <Link to={`/db/admin/lodgings/modify/${i}`}>
                                        <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                                    </Link>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </> : <p className={styles.msg_nok}>Aucun résultat trouvé</p>
                }
            </section>
}

export default AdminDashLodgingResults;