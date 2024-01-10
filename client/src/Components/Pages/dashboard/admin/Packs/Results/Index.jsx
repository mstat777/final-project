import styles from '../../results.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../../../../Functions/utils'; 

function AdminDashPackResults(){
    const { resultsPacks } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        resultsPacks.length && setShowResults(true);
    },[resultsPacks.length])

    return (showResults && resultsPacks[0]) &&
        <section className={styles.admin_db_section}>
            <h2>Résultats</h2>
            <table className={styles.results_table}>
                <thead>
                    <tr> 
                        <th>N&deg;</th> 
                        <th>Référence</th>
                        <th>Date départ</th>
                        <th>Date retour</th>
                        <th>Durée</th>
                        <th>Prix/adulte</th>
                        <th>Prix/enfant</th>
                        <th>Réduction</th>
                        <th>Places totales</th>
                        <th>Places restantes</th>
                        <th>Modifier</th>
                    </tr>
                </thead>
                <tbody>  
                { resultsPacks.map((el, i) => 
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{el.p.reference}</td>
                        <td>{formatDate(el.p.departure_date)}</td>
                        <td>{formatDate(el.p.return_date)}</td>
                        <td>{el.p.duration}n.</td>
                        <td>{el.p.price_adults}</td>
                        <td>{el.p.price_children}</td>
                        <td>{el.p.discount}</td>
                        <td>{el.p.places_total}</td>
                        <td>{el.p.places_left}</td>
                        <td>
                            <Link to={`/db/admin/packs/modify/${i}`}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                            </Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </section>
}

export default AdminDashPackResults;