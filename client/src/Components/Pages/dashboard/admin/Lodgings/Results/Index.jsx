import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../results.module.css';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function AdminDashLodgingResults(){
    const navigate = useNavigate();

    const { resultsLodgings } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // ne pas afficher de résultats au début:
    useEffect(() => {
        setShowResults(false);
    },[])

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        console.log(resultsLodgings.length);
        console.log("showResults = "+showResults);
        if (resultsLodgings.length) {
            setShowResults(true);
        }
    },[resultsLodgings.length])

    return <>
        { console.log(resultsLodgings)}
        { console.log("showResults = "+showResults)}
        { showResults && 
        <>
        {resultsLodgings[0] ? <>
        <h3>Résultats</h3>
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
            { resultsLodgings.map((el, index) => 
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{el.l.name}</td>
                    <td>{el.l.type}</td>
                    <td>{el.l.overview}</td>
                    <td>
                        <Link to={`/db/admin/lodgings/modify/${index}`}>
                            <FontAwesomeIcon icon={faPencil} className={styles.modify_icon}/>
                        </Link>
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

export default AdminDashLodgingResults;