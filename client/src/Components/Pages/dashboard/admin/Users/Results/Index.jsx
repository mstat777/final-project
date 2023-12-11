import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './results.module.css';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function AdminDashUserResults(){

    const { resultsUsers } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        if (resultsUsers.length) {
            setShowResults(true);
        }
    },[resultsUsers.length])

    return <>
        { console.log(resultsUsers)}
        { console.log("showResults = "+showResults)}
        { showResults && 
        <>
        {resultsUsers[0] ? <>
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
            { resultsUsers.map((el, index) => 
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{el.l.name}</td>
                    <td>{el.l.type}</td>
                    <td>{el.l.overview}</td>
                    <td>
                        <button>modifier</button>
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

export default AdminDashUserResults;