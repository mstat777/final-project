import styles from '../../results.module.scss';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { trimDate, formatDate } from '../../../../../Functions/utils';

function AdminDashUserResults(){
    const { resultsUsers } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // si des résultats trouvés, afficher le containeur :
    useEffect(() => {
        resultsUsers.length && setShowResults(true);
    },[resultsUsers.length])

    return (showResults && resultsUsers[0]) &&
        <section className={styles.admin_db_section}>
            <h2>Résultats</h2>
            <table className={styles.results_table}>
                <thead>
                    <tr> 
                        <th>N&deg;</th> 
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Mail</th>
                        <th>Tél.</th>
                        <th>Adresse</th>
                        <th>Date de naissance</th>
                        <th>Métier</th>        
                        <th>Compte créé</th>
                    </tr>
                </thead>
                <tbody>  
                { resultsUsers.map((el, i) => 
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td><b>{el.u.last_name}</b></td>
                        <td><b>{el.u.first_name}</b></td>           
                        <td>{el.u.email}</td>   
                        <td>{el.u.tel}</td>   
                        <td>{el.u.address}</td>  
                        <td>{formatDate(el.u.birth_date)}</td>  
                        <td>{el.u.occupation}</td>    
                        <td>{trimDate(el.u.date_created)}</td>              
                    </tr>
                )}
                </tbody>
            </table>
        </section>
}

export default AdminDashUserResults;