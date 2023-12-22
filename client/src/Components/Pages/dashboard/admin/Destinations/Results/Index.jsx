import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../results.module.css';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function AdminDashDestinationResults(){
    const navigate = useNavigate();

    const { resultsDestinations } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        if (resultsDestinations.length) {
            setShowResults(true);
        }
    },[resultsDestinations.length])

    return <>
        { console.log(resultsDestinations)}
        { console.log("showResults = "+showResults)}
        { showResults && 
        <div className={styles.admin_db_section}>
            {resultsDestinations[0] ? <>
            <h3>Résultats</h3>
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
                        <td>{el.d.name}</td>
                        <td>{el.d.country}</td>
                        <td>{el.d.continent}</td>
                        <td>{el.d.overview}</td>
                        <td>{el.d.departure_place}</td>
                        <td>{el.d.date_created.slice(0, el.d.date_created.indexOf('T'))}</td>
                        <td>
                            <button type="button" 
                                    onClick={() => {
                                        navigate(`/dashboard/admin/destinations/modify/${i}`);
                                    }} 
                                    className={styles.book_btn}>
                                <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
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

export default AdminDashDestinationResults;